import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { Camera, Timer, Trophy, ArrowLeft, Zap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DUCK_TARGETS = [
  { emoji: "🦆", name: "Common Mallard", points: 10, rarity: "Common", hint: "Yellow bill, green head" },
  { emoji: "🐦‍⬛", name: "Shadow Duck", points: 30, rarity: "Rare", hint: "All black plumage" },
  { emoji: "🦢", name: "Tropical Teal", points: 20, rarity: "Uncommon", hint: "Teal/turquoise color" },
  { emoji: "👑", name: "Royal Quacker", points: 100, rarity: "Legendary", hint: "Wears a golden crown" },
  { emoji: "🦅", name: "Eagle Duck", points: 50, rarity: "Epic", hint: "Eagle-like features" },
];

const DECOYS = ["🐟", "🐸", "🐢", "🐇", "🐿️"];

interface Target {
  id: number;
  type: "target" | "decoy";
  emoji: string;
  x: number;
  y: number;
  targetInfo?: typeof DUCK_TARGETS[0];
  opacity: number;
  visible: boolean;
}

const DuckShot = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [targets, setTargets] = useState<Target[]>([]);
  const [showHints, setShowHints] = useState(true);
  const [currentTarget, setCurrentTarget] = useState<typeof DUCK_TARGETS[0] | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [missFlash, setMissFlash] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const pickNewTarget = useCallback(() => {
    const random = DUCK_TARGETS[Math.floor(Math.random() * DUCK_TARGETS.length)];
    setCurrentTarget(random);
    return random;
  }, []);

  const spawnTargets = useCallback((target: typeof DUCK_TARGETS[0]) => {
    if (!gameAreaRef.current) return;
    const area = gameAreaRef.current.getBoundingClientRect();
    const numDecoys = 2 + Math.floor(Math.random() * 3);
    const newTargets: Target[] = [];
    const positions = new Set<string>();
    const getPos = () => {
      let x, y, key;
      do {
        x = Math.random() * (area.width - 80) + 20;
        y = Math.random() * (area.height - 80) + 20;
        key = `${Math.floor(x/60)},${Math.floor(y/60)}`;
      } while (positions.has(key));
      positions.add(key);
      return { x, y };
    };
    const targetPos = getPos();
    newTargets.push({
      id: targetIdRef.current++,
      type: "target",
      emoji: target.emoji,
      x: targetPos.x,
      y: targetPos.y,
      targetInfo: target,
      opacity: 1,
      visible: true,
    });
    for (let i = 0; i < numDecoys; i++) {
      const pos = getPos();
      newTargets.push({
        id: targetIdRef.current++,
        type: "decoy",
        emoji: DECOYS[Math.floor(Math.random() * DECOYS.length)],
        x: pos.x,
        y: pos.y,
        opacity: 1,
        visible: true,
      });
    }
    setTargets(newTargets);
  }, []);

  const nextRound = useCallback(() => {
    const target = pickNewTarget();
    setTimeout(() => spawnTargets(target), 500);
  }, [pickNewTarget, spawnTargets]);

  const handleShot = (t: Target) => {
    setShots(prev => prev + 1);
    setTargets(prev => prev.filter(x => x.id !== t.id));
    if (t.type === "target") {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      const bonus = Math.min(3, 1 + Math.floor(newStreak / 3));
      const pts = (t.targetInfo?.points || 10) * bonus;
      setScore(prev => prev + pts);
      setHits(prev => {
        const newHits = prev + 1;
        setAccuracy(Math.round((newHits / (shots + 1)) * 100));
        return newHits;
      });
      if (newStreak > 1) {
        toast({ title: `${newStreak}x Streak! +${pts}pts` });
      }
      nextRound();
    } else {
      setStreak(0);
      setMissFlash(true);
      setTimeout(() => setMissFlash(false), 500);
      setAccuracy(prev => Math.max(0, prev - 5));
    }
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { setGameState("gameover"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setShots(0);
    setHits(0);
    setTimeLeft(45);
    setAccuracy(100);
    setStreak(0);
    setMaxStreak(0);
    nextRound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 via-green-600 to-green-400">
      <Navigation />
      <div className="pt-16">
        {gameState === "playing" && (
          <div className="fixed top-16 left-0 right-0 z-40 bg-black/70 backdrop-blur-sm p-2">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-black font-display text-lg px-3">
                  <Trophy className="w-4 h-4 mr-1" />{score}
                </Badge>
                <Badge variant="outline" className="text-white border-white">
                  🎯 {accuracy}%
                </Badge>
              </div>
              <div className="text-center">
                {currentTarget && (
                  <div className="text-white font-body text-sm">
                    Find: <span className="text-xl">{currentTarget.emoji}</span> {showHints && <span className="text-gray-300">({currentTarget.hint})</span>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowHints(!showHints)} className="text-white">
                  {showHints ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-1 text-white">
                  <Timer className="w-4 h-4" />
                  <span className={`font-display text-xl ${timeLeft <= 10 ? "text-red-400 animate-pulse" : ""}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          ref={gameAreaRef}
          className={`relative w-full cursor-crosshair select-none transition-all ${missFlash ? "bg-red-900/50" : ""}`}
          style={{ height: "calc(100vh - 116px)", marginTop: "50px" }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            {["🌳", "🌿", "🌴", "🌱"].map((t, i) => (
              <div key={i} className="absolute text-6xl" style={{ left: `${15 + i * 25}%`, bottom: 0 }}>{t}</div>
            ))}
          </div>

          {gameState === "playing" && targets.map(t => (
            <button
              key={t.id}
              className="absolute transition-none hover:scale-110 active:scale-90"
              style={{ left: t.x, top: t.y, fontSize: 48 }}
              onClick={() => handleShot(t)}
            >
              {t.emoji}
            </button>
          ))}

          {(gameState === "idle" || gameState === "gameover") && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="card-tropical bg-card p-8 text-center max-w-md">
                {gameState === "gameover" ? (
                  <>
                    <div className="text-5xl mb-3">🎯</div>
                    <h2 className="font-display text-3xl mb-2">Time's Up!</h2>
                    <div className="space-y-1 font-body mb-6">
                      <p className="text-2xl font-bold">Score: {score}</p>
                      <p>Accuracy: {accuracy}% | Hits: {hits}/{shots}</p>
                      <p>Max Streak: {maxStreak}x</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-3 animate-bounce">🎯</div>
                    <h2 className="font-display text-3xl mb-2">Duck Shot</h2>
                    <p className="font-body text-muted-foreground mb-6">
                      Find and shoot the correct duck! Avoid decoys.
                    </p>
                  </>
                )}
                <div className="flex gap-3 justify-center">
                  <Button onClick={startGame} className="btn-primary text-lg px-8">
                    {gameState === "gameover" ? "Play Again" : "Start"}
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/games")}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuckShot;
