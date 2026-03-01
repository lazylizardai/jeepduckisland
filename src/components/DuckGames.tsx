import { Button } from "@/components/ui/button";
import { Gamepad2, Timer, Target, Zap } from "lucide-react";

const games = [
  {
    icon: Target,
    title: "Duck Hunt 3D",
    description: "Spot ducks in a 3D island environment before they escape",
    players: "1,234 playing",
    reward: "50 QUACK",
    color: "text-red-500",
  },
  {
    icon: Timer,
    title: "Speed Quack",
    description: "Race against time to identify as many ducks as possible",
    players: "892 playing",
    reward: "30 QUACK",
    color: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Duck Blitz",
    description: "Lightning-fast duck identification challenges",
    players: "2,156 playing",
    reward: "75 QUACK",
    color: "text-yellow-500",
  },
];

const DuckGames = () => {
  return (
    <section id="games" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Duck Games</h2>
        <p className="text-center text-gray-600 mb-12">
          Play games, earn QUACK tokens, and climb the leaderboard
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow"
            >
              <game.icon className={`w-10 h-10 ${game.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4" />
                  {game.players}
                </span>
                <span className="font-semibold text-green-600">
                  {game.reward}
                </span>
              </div>
              <Button className="w-full">Play Now</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckGames;
