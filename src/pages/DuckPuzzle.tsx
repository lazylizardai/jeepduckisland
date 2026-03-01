import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Trophy, RotateCcw, Timer, Volume2, VolumeX } from "lucide-react";
import quackyJack from "@/assets/quacky-jack.png";
import { useGameSounds } from "@/hooks/useGameSounds";

interface Tile {
  id: number;
  currentPos: number;
  correctPos: number;
}

type Difficulty = 3 | 4 | 5;

const DIFFICULTY_CONFIG = {
  3: { label: "Easy", emoji: "🟢", baseScore: 10000, timePenalty: 10, movePenalty: 5 },
  4: { label: "Medium", emoji: "🟡", baseScore: 15000, timePenalty: 8, movePenalty: 4 },
  5: { label: "Hard", emoji: "🔴", baseScore: 25000, timePenalty: 5, movePenalty: 3 },
};

const TILE_EMOJIS = [
  "🦆", "🚙", "🌴", "🏝️", "☀️", "🌊", "🎯", "⭐",
  "🌺", "🐚", "🥥", "🦜", "🍍", "🌈", "🎣", "⛵",
  "🏄", "🌅", "🐠", "🦀", "🌸", "💎", "🔥", "🎪"
];

const DuckPuzzle = () => {
  const [gameState, setGameState] = useState<"idle" | "playing" | "ended">("idle");
  const [gridSize, setGridSize] = useState<Difficulty>(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({ 3: null, 4: null, 5: null });
  const [soundOn, setSoundOn] = useState(true);
  const { playSound, setSoundEnabled } = useGameSounds();

  const totalTiles = gridSize * gridSize;

  // Sync sound state
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn, setSoundEnabled]);

  // Load best times
  useEffect(() => {
    const times: Record<Difficulty, number | null> = { 3: null, 4: null, 5: null };
    ([3, 4, 5] as Difficulty[]).forEach((size) => {
      const saved = localStorage.getItem(`duckpuzzle-besttime-${size}`);
      if (saved) times[size] = parseInt(saved, 10);
    });
    setBestTimes(times);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (gameState !== "playing" || tiles.length === 0) return;

    const isSolved = tiles.every((tile) => tile.currentPos === tile.correctPos);
    if (isSolved) {
      playSound("win");
      setGameState("ended");
      const currentBest = bestTimes[gridSize];
      if (!currentBest || timeElapsed < currentBest) {
        setBestTimes((prev) => ({ ...prev, [gridSize]: timeElapsed }));
        localStorage.setItem(`duckpuzzle-besttime-${gridSize}`, timeElapsed.toString());
      }
    }
  }, [tiles, gameState, timeElapsed, bestTimes, gridSize, playSound]);

  const shuffleTiles = () => {
    const newTiles: Tile[] = [];
    const positions = Array.from({ length: totalTiles - 1 }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Ensure puzzle is solvable
    let inversions = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i] > positions[j]) inversions++;
      }
    }
    
    // For odd grid sizes, need even inversions; for even grid sizes, more complex rule
    if (gridSize % 2 === 1) {
      if (inversions % 2 !== 0) {
        [positions[0], positions[1]] = [positions[1], positions[0]];
      }
    } else {
      // For even grid, the blank is in the last row (gridSize-1 from bottom = row 0)
      const blankRowFromBottom = 1; // blank is at bottom
      if ((inversions + blankRowFromBottom) % 2 === 0) {
        [positions[0], positions[1]] = [positions[1], positions[0]];
      }
    }

    positions.forEach((pos, index) => {
      newTiles.push({
        id: pos + 1,
        currentPos: index,
        correctPos: pos,
      });
    });

    // Add empty tile
    newTiles.push({
      id: 0,
      currentPos: totalTiles - 1,
      correctPos: totalTiles - 1,
    });

    return newTiles;
  };

  const startGame = (size?: Difficulty) => {
    playSound("gameStart");
    if (size) setGridSize(size);
    const newSize = size || gridSize;
    const newTotalTiles = newSize * newSize;
    
    // Generate tiles for the new size
    const newTiles: Tile[] = [];
    const positions = Array.from({ length: newTotalTiles - 1 }, (_, i) => i);
    
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let inversions = 0;
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i] > positions[j]) inversions++;
      }
    }
    
    if (newSize % 2 === 1) {
      if (inversions % 2 !== 0) {
        [positions[0], positions[1]] = [positions[1], positions[0]];
      }
    } else {
      const blankRowFromBottom = 1;
      if ((inversions + blankRowFromBottom) % 2 === 0) {
        [positions[0], positions[1]] = [positions[1], positions[0]];
      }
    }

    positions.forEach((pos, index) => {
      newTiles.push({
        id: pos + 1,
        currentPos: index,
        correctPos: pos,
      });
    });

    newTiles.push({
      id: 0,
      currentPos: newTotalTiles - 1,
      correctPos: newTotalTiles - 1,
    });

    setTiles(newTiles);
    setMoves(0);
    setTimeElapsed(0);
    setGameState("playing");
  };

  const getEmptyTilePos = () => {
    return tiles.find((t) => t.id === 0)?.currentPos ?? -1;
  };

  const canMove = (pos: number) => {
    const emptyPos = getEmptyTilePos();
    const emptyRow = Math.floor(emptyPos / gridSize);
    const emptyCol = emptyPos % gridSize;
    const tileRow = Math.floor(pos / gridSize);
    const tileCol = pos % gridSize;

    return (
      (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
      (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow)
    );
  };

  const moveTile = (pos: number) => {
    if (gameState !== "playing" || !canMove(pos)) return;

    playSound("tileMove");
    const emptyPos = getEmptyTilePos();
    setTiles((prev) =>
      prev.map((tile) => {
        if (tile.currentPos === pos) {
          return { ...tile, currentPos: emptyPos };
        }
        if (tile.id === 0) {
          return { ...tile, currentPos: pos };
        }
        return tile;
      })
    );
    setMoves((m) => m + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = () => {
    const config = DIFFICULTY_CONFIG[gridSize];
    const timePenalty = timeElapsed * config.timePenalty;
    const movePenalty = moves * config.movePenalty;
    return Math.max(0, config.baseScore - timePenalty - movePenalty);
  };

  const getTileColor = (id: number) => {
    if (id === 0) return "bg-transparent";
    const colors = [
      "bg-primary", "bg-secondary", "bg-accent",
      "bg-coral", "bg-turquoise", "bg-palm",
      "bg-primary/80", "bg-secondary/80", "bg-accent/80",
      "bg-coral/80", "bg-turquoise/80", "bg-palm/80",
      "bg-primary/60", "bg-secondary/60", "bg-accent/60",
      "bg-coral/60", "bg-turquoise/60", "bg-palm/60",
      "bg-primary/90", "bg-secondary/90", "bg-accent/90",
      "bg-coral/90", "bg-turquoise/90", "bg-palm/90",
    ];
    return colors[(id - 1) % colors.length];
  };

  const getTileEmoji = (id: number) => {
    if (id === 0 || id > TILE_EMOJIS.length) return id.toString();
    return TILE_EMOJIS[id - 1];
  };

  const getTileSize = () => {
    if (gridSize === 3) return "text-4xl";
    if (gridSize === 4) return "text-3xl";
    return "text-2xl";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-turquoise via-turquoise/80 to-palm overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-20">
        <Link to="/games" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-bold bg-card/80 px-3 py-2 rounded-full">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Games
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="bg-card/90 px-3 py-2 rounded-full border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          {bestTimes[gridSize] && (
            <div className="bg-card/90 px-4 py-2 rounded-full border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-display text-lg">{formatTime(bestTimes[gridSize]!)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative max-w-md mx-auto">
          {/* HUD */}
          {gameState === "playing" && (
            <div className="flex gap-4 justify-center mb-6 flex-wrap">
              <div className="bg-card px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-display text-xl flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="bg-card px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-display text-xl">Moves: {moves}</span>
              </div>
              <div className="bg-card px-4 py-2 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-display text-lg">{gridSize}x{gridSize}</span>
              </div>
            </div>
          )}

          {/* Puzzle Grid */}
          {gameState === "playing" && (
            <div className="bg-card p-4 rounded-2xl border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div 
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {Array.from({ length: totalTiles }).map((_, pos) => {
                  const tile = tiles.find((t) => t.currentPos === pos);
                  if (!tile || tile.id === 0) {
                    return (
                      <div
                        key={pos}
                        className="aspect-square rounded-xl bg-muted/30"
                      />
                    );
                  }
                  return (
                    <button
                      key={pos}
                      onClick={() => moveTile(pos)}
                      disabled={!canMove(pos)}
                      className={`aspect-square rounded-xl ${getTileColor(tile.id)} border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-display ${getTileSize()} text-foreground transition-all ${
                        canMove(pos) ? "hover:scale-105 cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {getTileEmoji(tile.id)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Idle Screen */}
          {gameState === "idle" && (
            <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
              <img src={quackyJack} alt="Duck" className="w-24 h-24 mx-auto mb-4 animate-bounce" />
              <h1 className="font-display text-5xl text-foreground mb-4">Duck Puzzle!</h1>
              <p className="text-muted-foreground mb-6">
                Schuif de tegels om de puzzel op te lossen. Hoe sneller, hoe hoger je score!
              </p>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <p className="font-display text-xl mb-3">Kies moeilijkheid:</p>
                <div className="flex gap-3 justify-center">
                  {([3, 4, 5] as Difficulty[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSize(size)}
                      className={`p-4 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                        gridSize === size 
                          ? "bg-primary scale-105" 
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      <p className="font-display text-2xl">{size}x{size}</p>
                      <p className="text-sm">{DIFFICULTY_CONFIG[size].emoji} {DIFFICULTY_CONFIG[size].label}</p>
                      {bestTimes[size] && (
                        <p className="text-xs text-muted-foreground mt-1">
                          🏆 {formatTime(bestTimes[size]!)}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => startGame()}
                className="font-display text-2xl py-6 px-8 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
              >
                <Play className="mr-2 h-6 w-6" />
                Start {gridSize}x{gridSize}!
              </Button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === "ended" && (
            <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center animate-scale-in">
              <h2 className="font-display text-5xl text-foreground mb-2">Opgelost! 🎉</h2>
              <p className="text-muted-foreground mb-4">{gridSize}x{gridSize} {DIFFICULTY_CONFIG[gridSize].label}</p>

              <div className="my-6">
                <p className="text-muted-foreground">Score</p>
                <p className="font-display text-6xl text-primary">{getScore()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div className="bg-muted/50 p-3 rounded-xl">
                  <p className="font-display text-2xl text-turquoise">{formatTime(timeElapsed)}</p>
                  <p className="text-xs text-muted-foreground">Tijd</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl">
                  <p className="font-display text-2xl text-coral">{moves}</p>
                  <p className="text-xs text-muted-foreground">Moves</p>
                </div>
              </div>

              {bestTimes[gridSize] === timeElapsed && (
                <div className="bg-primary/20 rounded-xl p-3 mb-4 border-2 border-primary">
                  <p className="font-display text-xl text-primary flex items-center justify-center gap-2">
                    <Trophy className="h-6 w-6" />
                    Nieuwe Beste Tijd!
                  </p>
                </div>
              )}

              <div className="bg-muted/30 rounded-xl p-3 mb-6 border border-foreground/10">
                <p className="text-sm text-muted-foreground">🔐 Score opslaan (coming soon!)</p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  onClick={() => startGame()}
                  className="font-display text-xl py-5 px-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Opnieuw
                </Button>
                <Button
                  onClick={() => setGameState("idle")}
                  variant="outline"
                  className="font-display text-xl py-5 px-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Kies Level
                </Button>
                <Link to="/games">
                  <Button
                    variant="outline"
                    className="font-display text-xl py-5 px-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Games
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuckPuzzle;
