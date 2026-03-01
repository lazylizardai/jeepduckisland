import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Timer, Trophy, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DUCK_EMOJIS = ["🦆", "🐦", "🦢", "🐢", "🐸", "🌼", "🌟", "🍎"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const DuckMemory = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">("idle");
  const [gridSize, setGridSize] = useState<4 | 6>(4);
  const { toast } = useToast();
  const navigate = useNavigate();

  const initGame = (size: 4 | 6 = gridSize) => {
    const totalCards = size * size;
    const pairs = totalCards / 2;
    const selectedEmojis = DUCK_EMOJIS.slice(0, pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [first, second] = flipped;
    const firstCard = cards[first];
    const secondCard = cards[second];

    if (firstCard.emoji === secondCard.emoji) {
      setMatched(prev => [...prev, firstCard.emoji]);
      setCards(prev => prev.map(c =>
        c.emoji === firstCard.emoji ? { ...c, isMatched: true } : c
      ));
      setFlipped([]);
      if (matched.length + 1 === cards.length / 2) {
        setGameState("won");
        toast({
          title: "You won! 🎉",
          description: `${moves + 1} moves in ${timeElapsed}s`
        });
      }
    } else {
      setTimeout(() => setFlipped([]), 1000);
    }
    setMoves(prev => prev + 1);
  }, [flipped]);

  const flipCard = (index: number) => {
    if (gameState !== "playing") return;
    if (flipped.length === 2) return;
    if (flipped.includes(index)) return;
    if (cards[index].isMatched) return;
    setFlipped(prev => [...prev, index]);
  };

  const isCardVisible = (index: number) =>
    flipped.includes(index) || cards[index]?.isMatched;

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow via-duck-orange/30 to-duck-teal/30">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/games")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-4xl">Duck Memory</h1>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <Badge className="text-lg px-4 py-2 bg-duck-yellow text-black">
            <Trophy className="w-4 h-4 mr-1" /> Moves: {moves}
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Timer className="w-4 h-4 mr-1" /> {timeElapsed}s
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            🦆 {matched.length}/{cards.length / 2} pairs
          </Badge>
        </div>

        {gameState === "idle" ? (
          <div className="card-tropical bg-card p-8 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4 animate-bounce">🦆</div>
            <h2 className="font-display text-3xl mb-4">Duck Memory</h2>
            <p className="font-body text-muted-foreground mb-6">
              Match all duck pairs as fast as possible!
            </p>
            <div className="flex gap-3 justify-center mb-4">
              <Button
                variant={gridSize === 4 ? "default" : "outline"}
                onClick={() => setGridSize(4)}
              >
                4x4
              </Button>
              <Button
                variant={gridSize === 6 ? "default" : "outline"}
                onClick={() => setGridSize(6)}
              >
                6x6
              </Button>
            </div>
            <Button onClick={() => initGame()} className="btn-primary text-lg px-8">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            {gameState === "won" && (
              <div className="card-tropical bg-card p-6 text-center mb-6 max-w-md mx-auto">
                <div className="text-5xl mb-2">🎉</div>
                <h2 className="font-display text-3xl mb-2">Excellent!</h2>
                <p className="font-body">Completed in {moves} moves and {timeElapsed} seconds!</p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button onClick={() => initGame()} className="btn-primary">
                    <RotateCcw className="w-4 h-4 mr-1" /> Play Again
                  </Button>
                  <Button variant="outline" onClick={() => setGameState("idle")}>Change Size</Button>
                </div>
              </div>
            )}
            <div
              className={`grid gap-3 max-w-2xl mx-auto`}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => flipCard(index)}
                  className={`
                    aspect-square rounded-xl border-4 text-4xl font-bold
                    transition-all duration-300 hover:scale-105
                    ${card.isMatched
                      ? "border-green-400 bg-green-100 scale-95"
                      : isCardVisible(index)
                      ? "border-duck-orange bg-duck-yellow/50 scale-105"
                      : "border-outline bg-card hover:bg-muted cursor-pointer"
                    }
                  `}
                  disabled={card.isMatched}
                >
                  {isCardVisible(index) ? card.emoji : "👍"}
                </button>
              ))}
            </div>
            {gameState === "playing" && (
              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => initGame()}>
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

export default DuckMemory;
