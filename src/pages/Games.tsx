import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gamepad2, Target, Brain, Grid3X3, Puzzle } from "lucide-react";
import Navigation from "@/components/Navigation";

const Games = () => {
  const games = [
    {
      id: "duck-shot",
      title: "Duck Shot!",
      description: "Klik op de eendjes voor 30 seconden! Zeldzame eendjes geven meer punten.",
      icon: "🎯",
      emoji: "🦆",
      color: "bg-sky-400",
      link: "/duck-shot",
      badge: "Leaderboard",
      badgeColor: "bg-yellow-400",
    },
    {
      id: "duck-memory",
      title: "Duck Memory",
      description: "Vind alle paren! Hoe sneller je alle kaartjes matcht, hoe hoger je score.",
      icon: "🧠",
      emoji: "🃏",
      color: "bg-purple-400",
      link: "/duck-memory",
      badge: "Nieuw",
      badgeColor: "bg-green-400",
    },
    {
      id: "duck-hunt",
      title: "Duck Hunt",
      description: "Vang zoveel mogelijk eendjes! Gebruik het web om ze te vangen.",
      icon: "🕸️",
      emoji: "🦆",
      color: "bg-orange-400",
      link: "/duck-hunt",
      badge: "Bèta",
      badgeColor: "bg-orange-300",
    },
    {
      id: "duck-puzzle",
      title: "Duck Puzzle",
      description: "Schuif de tegels en los de puzzel op! Kies uit 3 moeilijkheidsgraden.",
      icon: "🧩",
      emoji: "🧩",
      color: "bg-teal-400",
      link: "/duck-puzzle",
      badge: "Nieuw",
      badgeColor: "bg-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-6xl md:text-7xl text-foreground mb-4">
            Duck Games! 🎮
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Speel leuke spellen en verdien punten voor je Duck profiel!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {games.map((game) => (
            <Link key={game.id} to={game.link} className="block group">
              <div className="bg-card rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all overflow-hidden">
                {/* Game Color Header */}
                <div className={`${game.color} p-8 flex items-center justify-center relative`}>
                  <span className="text-7xl">{game.emoji}</span>
                  {game.badge && (
                    <span className={`absolute top-3 right-3 ${game.badgeColor} text-foreground text-xs font-bold px-2 py-1 rounded-full border-2 border-foreground`}>
                      {game.badge}
                    </span>
                  )}
                </div>
                
                {/* Game Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{game.icon}</span>
                    <h3 className="font-display text-2xl text-foreground">{game.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More Games Coming Soon */}
        <div className="text-center mt-12">
          <div className="inline-block bg-card rounded-2xl p-6 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-display text-2xl text-muted-foreground">Meer spellen komen eraan! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;
