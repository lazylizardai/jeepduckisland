import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Gamepad2, Target, Brain, Puzzle, Camera } from "lucide-react";

const GAMES = [
  {
    title: "Duck Hunt",
    description: "Click ducks as they fly across the screen. Earn combo multipliers!",
    emoji: "🦆",
    path: "/games/duck-hunt",
    icon: Target,
    color: "bg-red-100",
    iconColor: "text-red-500",
    difficulty: "Easy",
    players: "1,234 playing",
    reward: "50 QUACK",
  },
  {
    title: "Duck Memory",
    description: "Match pairs of duck cards in this classic memory challenge.",
    emoji: "🧠",
    path: "/games/duck-memory",
    icon: Brain,
    color: "bg-blue-100",
    iconColor: "text-blue-500",
    difficulty: "Medium",
    players: "892 playing",
    reward: "30 QUACK",
  },
  {
    title: "Duck Puzzle",
    description: "Rearrange emoji tiles to recreate the duck scene.",
    emoji: "🧩",
    path: "/games/duck-puzzle",
    icon: Puzzle,
    color: "bg-green-100",
    iconColor: "text-green-500",
    difficulty: "Hard",
    players: "567 playing",
    reward: "75 QUACK",
  },
  {
    title: "Duck Shot",
    description: "Find the target duck among decoys. Test your eagle eyes!",
    emoji: "🎯",
    path: "/games/duck-shot",
    icon: Camera,
    color: "bg-purple-100",
    iconColor: "text-purple-500",
    difficulty: "Hard",
    players: "2,156 playing",
    reward: "75 QUACK",
  },
];

const Games = () => (
  <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
    <Navigation />
    <div className="pt-20 pb-10 container mx-auto px-4">
      <div className="text-center mb-10">
        <h1 className="font-display text-5xl mb-3">Duck Games 🎮</h1>
        <p className="font-body text-xl text-muted-foreground">Play games, earn QUACK tokens, and climb the leaderboard</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {GAMES.map((game) => (
          <div key={game.title} className="card-tropical bg-card p-6 hover-lift">
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 rounded-2xl ${game.color}`}>
                <game.icon className={`w-8 h-8 ${game.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-2xl">{game.title}</h2>
                  <span className="text-2xl">{game.emoji}</span>
                </div>
                <p className="font-body text-muted-foreground text-sm">{game.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="font-body text-xs bg-muted px-2 py-1 rounded-full">{game.difficulty}</span>
                <span className="font-body text-xs bg-muted px-2 py-1 rounded-full">{game.players}</span>
              </div>
              <Link to={game.path}>
                <Button className="btn-primary">
                  <Gamepad2 className="w-4 h-4 mr-1" /> Play ({game.reward})
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Games;
