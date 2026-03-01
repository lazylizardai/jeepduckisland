import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { Timer, Trophy, ArrowLeft, RotateCcw, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PUZZLE_LEVELS = [
  {
    id: 1,
    image: ["🦆", "🌳", "🚙", "🏖️", "🌊", "☀️", "🌴", "🌿", "🐟"],
    size: 3,
    name: "Duck at the Beach",
  },
  {
    id: 2,
    image: ["🦆", "🦆", "🌳", "🚙", "🌼", "🚙", "🌿", "🌿", "🏖️", "☀️", "🌊", "🌴", "🌟", "🐟", "☁️", "🐛"],
    size: 4,
    name: "Duck Island",
  },
  {
    id: 3,
    image: ["🦆", "🦆", "🦆", "🌳", "🚙",
            "🌼", "🚙", "🌿", "🐦", "🏖️",
            "☀️", "🌊", "🌴", "🌟", "🐟",
            "☁️", "🐛", "🌺", "🐞", "🍁",
            "🦋", "🌋", "🏆", "💫", "💰"],
    size: 5,
    name: "Duck Kingdom",
  }
];

interface PuzzlePiece {
  id: number;
  currentPos: number;
  emoji: string;
}

const DuckPuzzle = () => {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameState, setGameState] = useState<"select" | "playing" | "won">("select");
  const [hints, setHints] = useState(3);
  const [showHint, setShowHint] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const initPuzzle = (levelIdx: number) => {
    const level = PUZZLE_LEVELS[levelIdx];
    const shuffled = [...level.image]
      .map((emoji, id) => ({ id, currentPos: id, emoji }))
      .sort(() => Math.random() - 0.5)
      .map((piece, pos) => ({ ...piece, currentPos: pos }));
    setPieces(shuffled);
    setSelected(null);
    setMoves(0);
    setTimeElapsed(0);
    setGameState("playing");
    setSelectedLevel(levelIdx);
    setHints(3);
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const checkWin = (currentPieces: PuzzlePiece[]) => {
    return currentPieces.every(piece => piece.id === piece.currentPos);
  };

  const handlePieceClick = (pos: number) => {
    if (gameState !== "playing") return;
    if (selected === null) {
      setSelected(pos);
    } else if (selected === pos) {
      setSelected(null);
    } else {
      const newPieces = [...pieces];
      const fromIdx = newPieces.findIndex(p => p.currentPos === selected);
      const toIdx = newPieces.findIndex(p => p.currentPos === pos);
      if (fromIdx !== -1 && toIdx !== -1) {
        [newPieces[fromIdx].currentPos, newPieces[toIdx].currentPos] =
          [newPieces[toIdx].currentPos, newPieces[fromIdx].currentPos];
        setPieces(newPieces);
        setMoves(prev => prev + 1);
        setSelected(null);
        if (checkWin(newPieces)) {
          setGameState("won");
          toast({
            title: "Puzzle solved! 🎉",
            description: `${moves + 1} moves in ${timeElapsed}s`
          });
        }
      }
    }
  };

  const useHint = () => {
    if (hints <= 0) return;
    const wrongPiece = pieces.find(p => p.id !== p.currentPos);
    if (wrongPiece) {
      setShowHint(wrongPiece.currentPos);
      setHints(prev => prev - 1);
      setTimeout(() => setShowHint(null), 2000);
    }
  };

  const level = PUZZLE_LEVELS[selectedLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-teal/30 via-background to-duck-yellow/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/games")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-4xl">Duck Puzzle</h1>
        </div>

        {gameState === "select" ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {PUZZLE_LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                onClick={() => initPuzzle(idx)}
                className="card-tropical bg-card p-6 text-center hover-lift text-left"
              >
                <div className="grid gap-1 mb-4" style={{ gridTemplateColumns: `repeat(${lvl.size}, 1fr)` }}>
                  {lvl.image.map((emoji, i) => (
                    <span key={i} className="text-2xl">{emoji}</span>
                  ))}
                </div>
                <h3 className="font-display text-xl">{lvl.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{lvl.size}x{lvl.size} grid</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <Badge className="text-lg px-4 py-2 bg-duck-yellow text-black">
                <Trophy className="w-4 h-4 mr-1" /> Moves: {moves}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Timer className="w-4 h-4 mr-1" /> {timeElapsed}s
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={useHint}
                disabled={hints <= 0}
                className="text-lg"
              >
                <Lightbulb className="w-4 h-4 mr-1" /> Hints: {hints}
              </Button>
            </div>

            {gameState === "won" && (
              <div className="card-tropical bg-card p-6 text-center mb-6 max-w-md mx-auto">
                <div className="text-5xl mb-2">🎉</div>
                <h2 className="font-display text-3xl mb-2">Puzzle Complete!</h2>
                <p className="font-body">{moves} moves in {timeElapsed} seconds</p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button onClick={() => setGameState("select")} className="btn-primary">
                    Choose Level
                  </Button>
                  <Button variant="outline" onClick={() => initPuzzle(selectedLevel)}>
                    <RotateCcw className="w-4 h-4 mr-1" /> Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Puzzle grid */}
            <div className="max-w-lg mx-auto">
              <h2 className="font-display text-2xl mb-4 text-center">{level.name}</h2>
              <div
                className="grid gap-2 p-4 bg-card rounded-3xl border-4 border-outline shadow-cartoon-lg"
                style={{ gridTemplateColumns: `repeat(${level.size}, 1fr)` }}
              >
                {Array.from({ length: level.size * level.size }).map((_, pos) => {
                  const piece = pieces.find(p => p.currentPos === pos);
                  const isSelected = selected === pos;
                  const isHinted = showHint === pos;
                  const isCorrect = piece?.id === pos;
                  return (
                    <button
                      key={pos}
                      onClick={() => handlePieceClick(pos)}
                      className={`
                        aspect-square rounded-xl border-3 text-3xl font-bold transition-all
                        ${isSelected ? "border-duck-orange bg-duck-yellow/50 scale-110 shadow-lg" :
                          isHinted ? "border-red-400 bg-red-100 animate-pulse" :
                          isCorrect && gameState === "won" ? "border-green-400 bg-green-100" :
                          "border-outline bg-muted/50 hover:bg-muted cursor-pointer hover:scale-105"}
                      `}
                      disabled={gameState === "won"}
                    >
                      {piece?.emoji}
                    </button>
                  );
                })}
              </div>
              <p className="text-center font-body text-sm text-muted-foreground mt-3">
                Click a piece, then click where to move it
              </p>
            </div>

            {gameState === "playing" && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => initPuzzle(selectedLevel)}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Restart
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DuckPuzzle;
