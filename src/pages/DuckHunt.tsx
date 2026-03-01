import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { Target, Timer, Zap, Trophy, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Duck {
  id: number;
  x: number;
  y: number;
  emoji: string;
  points: number;
  speed: number;
  direction: number;
  size: number;
  type: "normal" | "rare" | "legendary" | "bomb";
}

const DUCK_TYPES = {
  normal: { emojis: ["🦆", "🐦", "🦢"], points: 10, probability: 0.6, size: 50 },
  rare: { emojis: ["🐦‍⬛", "🦅"], points: 25, probability: 0.25, size: 55 },
  legendary: { emojis: ["👑", "⭐"], points: 50, probability: 0.1, size: 60 },
  bomb: { emojis: ["💣", "💀"], points: -20, probability: 0.05, size: 45 },
};

const DuckHunt = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "paused" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [ducksHit, setDucksHit] = useState(0);
  const [ducksMissed, setDucksMissed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCombo, setShowCombo] = useState(false);
  const [comboText, setComboText] = useState("");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const duckIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const spawnDuck = useCallback(() => {
    if (!gameAreaRef.current) return;
    const area = gameAreaRef.current.getBoundingClientRect();
    const rand = Math.random();
    let type: Duck["type"] = "normal";
    let cumulative = 0;
    for (const [t, config] of Object.entries(DUCK_TYPES)) {
      cumulative += config.probability;
      if (rand <= cumulative) { type = t as Duck["type"]; break; }
    }
    const config = DUCK_TYPES[type];
    const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)];
    const fromLeft = Math.random() > 0.5;
    const duck: Duck = {
      id: duckIdRef.current++,
      x: fromLeft ? -60 : area.width + 60,
      y: Math.random() * (area.height - 100) + 20,
      emoji,
      points: config.points,
      speed: (2 + level * 0.5) * (fromLeft ? 1 : -1),
      direction: fromLeft ? 1 : -1,
      size: config.size,
      type,
    };
    setDucks(prev => [...prev, duck]);
  }, [level]);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameState !== "playing") return;
    const spawnInterval = Math.max(500, 2000 - level * 200);
    if (timestamp - lastSpawnRef.current > spawnInterval) {
      spawnDuck();
      lastSpawnRef.current = timestamp;
    }
    setDucks(prev => {
      const updated = prev.map(duck => ({
        ...duck,
        x: duck.x + duck.speed,
        y: duck.y + Math.sin(duck.x * 0.02) * 1.5,
      }));
      const escaped = updated.filter(d => {
        if (!gameAreaRef.current) return false;
        const area = gameAreaRef.current.getBoundingClientRect();
        return d.x < -100 || d.x > area.width + 100;
      });
      if (escaped.length > 0 && escaped.some(d => d.type !== "bomb")) {
        setDucksMissed(prev => prev + escaped.filter(d => d.type !== "bomb").length);
        setLives(prev => Math.max(0, prev - escaped.filter(d => d.type !== "bomb").length));
        setCombo(0);
      }
      return updated.filter(d => {
        if (!gameAreaRef.current) return true;
        const area = gameAreaRef.current.getBoundingClientRect();
        return d.x > -100 && d.x < area.width + 100;
      });
    });
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, level, spawnDuck]);

  useEffect(() => {
    if (gameState === "playing") {
      animationRef.current = requestAnimationFrame(gameLoop);
      return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }
  }, [gameState, gameLoop]);

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

  useEffect(() => {
    if (lives <= 0) setGameState("gameover");
  }, [lives]);

  useEffect(() => {
    const newLevel = Math.floor(score / 200) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast({ title: `Level ${newLevel}!`, description: "Ducks are getting faster!" });
    }
  }, [score, level, toast]);

  const hitDuck = (duck: Duck) => {
    setDucks(prev => prev.filter(d => d.id !== duck.id));
    if (duck.type === "bomb") {
      setScore(prev => Math.max(0, prev + duck.points));
      setLives(prev => Math.max(0, prev - 1));
      setCombo(0);
      toast({ title: "Boom! 💥", description: "That was a bomb!", variant: "destructive" });
    } else {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      const multiplier = Math.min(5, 1 + Math.floor(newCombo / 3));
      const points = duck.points * multiplier;
      setScore(prev => prev + points);
      setDucksHit(prev => prev + 1);
      if (newCombo > 1) {
        setComboText(`${newCombo}x COMBO! +${points}`);
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1000);
      }
    }
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setLevel(1);
    setDucks([]);
    setTimeLeft(60);
    setCombo(0);
    setMaxCombo(0);
    setDucksHit(0);
    setDucksMissed(0);
    lastSpawnRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-300">
      <Navigation />
      <div className="pt-16">
        {/* HUD */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-black/50 backdrop-blur-sm p-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < lives ? "" : "opacity-30"}`}>❤️</span>
                ))}
              </div>
              <Badge className="bg-yellow-500 text-black font-display text-lg px-3">
                <Trophy className="w-4 h-4 mr-1" />{score}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-white border-white">
                Level {level}
              </Badge>
              <div className="flex items-center gap-1 text-white">
                <Timer className="w-4 h-4" />
                <span className={`font-display text-xl ${timeLeft <= 10 ? "text-red-400 animate-pulse" : ""}`}>
                  {timeLeft}s
                </span>
              </div>
              <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-white">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div
          ref={gameAreaRef}
          className="relative w-full cursor-crosshair select-none"
          style={{ height: "calc(100vh - 120px)", marginTop: "50px" }}
          onClick={() => { if (gameState === "playing") { setCombo(0); } }}
        >
          {/* Sky/background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 text-6xl opacity-30 animate-float">☁️</div>
            <div className="absolute top-20 right-32 text-5xl opacity-20 animate-float" style={{animationDelay: "1s"}}>☁️</div>
            <div className="absolute top-5 left-1/2 text-4xl opacity-25 animate-float" style={{animationDelay: "2s"}}>☁️</div>
          </div>

          {/* Ducks */}
          {gameState === "playing" && ducks.map(duck => (
            <button
              key={duck.id}
              className="absolute transition-none cursor-crosshair hover:scale-110 active:scale-90"
              style={{
                left: duck.x,
                top: duck.y,
                fontSize: duck.size,
                transform: duck.direction < 0 ? "scaleX(-1)" : "scaleX(1)",
                filter: duck.type === "legendary" ? "drop-shadow(0 0 10px gold)" : 
                        duck.type === "bomb" ? "drop-shadow(0 0 8px red)" : "none",
              }}
              onClick={(e) => { e.stopPropagation(); hitDuck(duck); }}
            >
              {duck.emoji}
            </button>
          ))}

          {/* Combo display */}
          {showCombo && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 animate-bounce">
              <span className="font-display text-4xl text-yellow-400 drop-shadow-lg">{comboText}</span>
            </div>
          )}

          {/* Idle/Game Over overlay */}
          {(gameState === "idle" || gameState === "gameover") && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="card-tropical bg-card p-8 text-center max-w-md">
                {gameState === "gameover" ? (
                  <>
                    <div className="text-6xl mb-4">🦆</div>
                    <h2 className="font-display text-4xl mb-2">Game Over!</h2>
                    <div className="space-y-2 mb-6 font-body">
                      <p className="text-2xl font-bold">Score: {score}</p>
                      <p>Ducks Hit: {ducksHit} | Missed: {ducksMissed}</p>
                      <p>Max Combo: {maxCombo}x | Level Reached: {level}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4 animate-bounce">🦆</div>
                    <h2 className="font-display text-4xl mb-2">Duck Hunt</h2>
                    <p className="font-body text-muted-foreground mb-6">
                      Click the ducks to earn points! Avoid bombs 💣
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm font-body">
                      <div className="bg-muted rounded-lg p-2">🦆 Normal = 10pts</div>
                      <div className="bg-blue-100 rounded-lg p-2">🐦 Rare = 25pts</div>
                      <div className="bg-yellow-100 rounded-lg p-2">⭐ Legendary = 50pts</div>
                      <div className="bg-red-100 rounded-lg p-2">💣 Bomb = -20pts</div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 justify-center">
                  <Button onClick={startGame} className="btn-primary text-lg px-8">
                    {gameState === "gameover" ? "Play Again" : "Start Game"}
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

export default DuckHunt;
