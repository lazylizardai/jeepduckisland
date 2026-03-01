import { Award, Star, Trophy, Zap, Shield, Crown } from "lucide-react";

const badges = [
  {
    icon: Trophy,
    name: "Duck Champion",
    description: "Won 10+ duck-spotting contests",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Star,
    name: "Star Spotter",
    description: "Spotted 50+ rare duck varieties",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    name: "Speed Plucker",
    description: "Fastest duck catch in Island history",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Shield,
    name: "Duck Guardian",
    description: "Protected 100+ ducks from the Jeep",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Award,
    name: "Island Legend",
    description: "Reached top 3 on the leaderboard",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Crown,
    name: "Duck King",
    description: "Held #1 position for 30 days",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

const DuckBadges = () => {
  return (
    <section id="badges" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Duck Badges</h2>
        <p className="text-center text-gray-600 mb-12">
          Earn exclusive badges by mastering the art of duck spotting
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl border hover:shadow-md transition-shadow text-center"
            >
              <div className={`p-3 rounded-full ${badge.bg} mb-3`}>
                <badge.icon className={`w-6 h-6 ${badge.color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
              <p className="text-xs text-gray-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckBadges;
