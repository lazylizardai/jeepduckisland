import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Trophy, Target, Zap, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import quackyJack from "@/assets/quacky-jack.png";

interface Duck {
  id: number;
  x: number;
  y: number;
  type: "regular" | "rare" | "jeep";
  speed: number;
  direction: 1 | -1;
  hit: boolean;
}

interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  created_at: string;
}

const GAME_DURATION = 30;
const SPAWN_INTERVAL = 1200;

const DuckShot = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "ended" | "saving">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showHitEffect, setShowHitEffect] = useState<{ x: number; y: number; points: number } | null>(null);
  const [nickname, setNickname] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [saving, setSaving] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const duckIdRef = useRef(0);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("duckshot-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
    const savedNickname = localStorage.getItem("duckshot-nickname");
    if (savedNickname) setNickname(savedNickname);
    fetchLeaderboard();
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from("game_scores")
      .select("*")
      .eq("game_type", "duck-shot")
      .order("score", { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setLeaderboard(data);
    }
  };

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("duckshot-highscore", score.toString());
    }
  }, [score, highScore]);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawn ducks
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnDuck = () => {
      const rand = Math.random();
      let type: Duck["type"] = "regular";
      if (rand > 0.95) type = "jeep";
      else if (rand > 0.8) type = "rare";

      const direction: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const gameArea = gameAreaRef.current;
      const maxY = gameArea ? gameArea.clientHeight - 100 : 300;

      const newDuck: Duck = {
        id: duckIdRef.current++,
        x: direction === 1 ? -80 : (gameArea?.clientWidth || 800) + 80,
        y: Math.random() * maxY + 50,
        type,
        speed: 2 + Math.random() * 3,
        direction,
        hit: false,
      };

      setDucks((prev) => [...prev, newDuck]);
    };

    const spawner = setInterval(spawnDuck, SPAWN_INTERVAL);
    spawnDuck(); // Initial spawn

    return () => clearInterval(spawner);
  }, [gameState]);

  // Move ducks
  useEffect(() => {
    if (gameState !== "playing") return;

    const mover = setInterval(() => {
      setDucks((prev) => {
        const gameArea = gameAreaRef.current;
        const maxX = gameArea?.clientWidth || 800;

        return prev
          .map((duck) => ({
            ...duck,
            x: duck.x + duck.speed * duck.direction,
          }))
          .filter((duck) => {
            if (duck.hit) return false;
            if (duck.direction === 1 && duck.x > maxX + 100) return false;
            if (duck.direction === -1 && duck.x < -100) return false;
            return true;
          });
      });
    }, 16);

    return () => clearInterval(mover);
  }, [gameState]);

  const handleDuckClick = useCallback((duck: Duck, e: React.MouseEvent) => {
    e.stopPropagation();
    if (duck.hit || gameState !== "playing") return;

    let points = 10;
    if (duck.type === "rare") points = 50;
    if (duck.type === "jeep") points = 100;

    // Combo bonus
    const comboBonus = Math.floor(combo / 3) * 5;
    points += comboBonus;

    setScore((prev) => prev + points);
    setCombo((prev) => prev + 1);
    setShowHitEffect({ x: duck.x, y: duck.y, points });

    setTimeout(() => setShowHitEffect(null), 500);

    setDucks((prev) =>
      prev.map((d) => (d.id === duck.id ? { ...d, hit: true } : d))
    );

    // Remove hit duck after animation
    setTimeout(() => {
      setDucks((prev) => prev.filter((d) => d.id !== duck.id));
    }, 300);
  }, [combo, gameState]);

  const handleMiss = () => {
    if (gameState !== "playing") return;
    setCombo(0);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setDucks([]);
    setCombo(0);
    setGameState("playing");
  };

  const saveScore = async () => {
    if (!nickname.trim()) {
      toast.error("Voer een nickname in");
      return;
    }
    
    setSaving(true);
    localStorage.setItem("duckshot-nickname", nickname);
    
    const { error } = await supabase
      .from("game_scores")
      .insert({
        game_type: "duck-shot",
        nickname: nickname.trim(),
        score,
      });
    
    if (error) {
      toast.error("Kon score niet opslaan");
    } else {
      toast.success("Score opgeslagen!");
      fetchLeaderboard();
      setShowLeaderboard(true);
    }
    
    setSaving(false);
  };

  const getDuckEmoji = (type: Duck["type"]) => {
    if (type === "jeep") return "🚙";
    if (type === "rare") return "⭐🦆";
    return "🦆";
  };

  const getDuckSize = (type: Duck["type"]) => {
    if (type === "jeep") return "text-5xl";
    if (type === "rare") return "text-4xl";
    return "text-3xl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 overflow-hidden relative">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-20">
        <Link to="/games" className="inline-flex items-center text-white font-bold drop-shadow-md bg-black/20 px-3 py-2 rounded-full">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Games
        </Link>
        
        <div className="flex items-center gap-4">
          {highScore > 0 && (
            <div className="bg-yellow-400 px-4 py-2 rounded-full border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="font-display text-lg">{highScore}</span>
            </div>
          )}
          <button
            onClick={() => { fetchLeaderboard(); setShowLeaderboard(!showLeaderboard); }}
            className="bg-white/90 px-3 py-2 rounded-full border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-display"
          >
            🏆 Board
          </button>
        </div>
      </div>

      {/* Leaderboard Overlay */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-card rounded-3xl p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-3xl mb-4 text-center">🏆 Top 10</h2>
            {leaderboard.length === 0 ? (
              <p className="text-center text-muted-foreground">Nog geen scores!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={entry.id} className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-2">
                    <span className="font-display text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                    <span className="font-medium flex-1 mx-3 truncate">{entry.nickname}</span>
                    <span className="font-display text-lg text-primary">{entry.score}</span>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => setShowLeaderboard(false)} className="w-full mt-4 font-display">Sluiten</Button>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="relative w-full cursor-crosshair"
        style={{ height: 'calc(100vh - 80px)' }}
        onClick={handleMiss}
      >
        {/* Game HUD */}
        {gameState === "playing" && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-4 z-10 flex-wrap justify-center">
            <div className="bg-card px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-display text-2xl">⏱️ {timeLeft}s</span>
            </div>
            <div className="bg-card px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-display text-2xl">🎯 {score}</span>
            </div>
            {combo > 2 && (
              <div className="bg-yellow-400 px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                <span className="font-display text-2xl">⚡ x{combo}</span>
              </div>
            )}
          </div>
        )}

        {/* Ducks */}
        {ducks.map((duck) => (
          <button
            key={duck.id}
            className={`absolute transition-opacity ${duck.hit ? 'opacity-0 scale-150' : 'opacity-100'} cursor-pointer hover:scale-110 transition-transform select-none`}
            style={{
              left: duck.x,
              top: duck.y,
              transform: `scaleX(${duck.direction === -1 ? -1 : 1})`,
            }}
            onClick={(e) => handleDuckClick(duck, e)}
          >
            <span className={getDuckSize(duck.type)}>{getDuckEmoji(duck.type)}</span>
          </button>
        ))}

        {/* Hit Effect */}
        {showHitEffect && (
          <div
            className="absolute z-20 font-display text-2xl text-yellow-400 drop-shadow-lg animate-bounce pointer-events-none"
            style={{ left: showHitEffect.x, top: showHitEffect.y - 30 }}
          >
            +{showHitEffect.points}
          </div>
        )}

        {/* Idle Screen */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center max-w-sm w-full mx-4">
              <img src={quackyJack} alt="Duck" className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              <h1 className="font-display text-5xl text-foreground mb-4">Duck Shot!</h1>
              <p className="text-muted-foreground mb-2">Klik op de eendjes voor 30 seconden!</p>
              <p className="text-sm text-muted-foreground mb-6">
                🦆 Regulier: 10pt • ⭐🦆 Zeldzaam: 50pt • 🚙 Jeep: 100pt
              </p>
              <Button
                onClick={startGame}
                className="w-full font-display text-2xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <Play className="mr-2 h-6 w-6" />
                Start!
              </Button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState === "ended" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center max-w-sm w-full mx-4 animate-scale-in">
              <h2 className="font-display text-5xl text-foreground mb-2">Tijd op! 🎉</h2>
              
              <div className="my-6">
                <p className="text-muted-foreground">Score</p>
                <p className="font-display text-6xl text-primary">{score}</p>
                {score >= highScore && score > 0 && (
                  <p className="text-sm text-yellow-600 font-medium mt-1">🏆 Nieuwe High Score!</p>
                )}
              </div>

              {/* Save Score */}
              <div className="mb-6 space-y-3">
                <Input
                  placeholder="Jouw nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="border-4 border-foreground font-display text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  maxLength={20}
                />
                <Button
                  onClick={saveScore}
                  disabled={saving}
                  className="w-full font-display text-xl py-5 bg-yellow-400 hover:bg-yellow-300 text-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Medal className="mr-2 h-5 w-5" />
                  {saving ? "Opslaan..." : "Score Opslaan"}
                </Button>
              </div>

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={startGame}
                  className="font-display text-xl py-5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Opnieuw
                </Button>
                <Link to="/games">
                  <Button variant="outline" className="font-display text-xl py-5 px-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Games
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuckShot;
