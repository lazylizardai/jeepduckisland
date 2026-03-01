import { Trophy } from "lucide-react";

const leaders = [
  { rank: 1, name: "QuackMaster9000", score: 98420, duck: "🦆", badge: "👑" },
  { rank: 2, name: "DuckWhisperer", score: 87310, duck: "🦢", badge: "🥈" },
  { rank: 3, name: "IslandBoss", score: 76540, duck: "🐦", badge: "🥉" },
  { rank: 4, name: "GoldenQuacker", score: 65230, duck: "✨", badge: "" },
  { rank: 5, name: "SwampLord", score: 54120, duck: "🌿", badge: "" },
];

const HallOfKwak = () => {
  return (
    <section id="leaderboard" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-4xl font-bold">Hall of Kwak</h2>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-center text-gray-600 mb-12">
          The greatest duck spotters on the island
        </p>
        <div className="max-w-2xl mx-auto">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`flex items-center justify-between p-4 mb-3 rounded-xl border ${
                leader.rank === 1
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400 w-8">
                  {leader.rank}
                </span>
                <span className="text-2xl">{leader.duck}</span>
                <div>
                  <p className="font-semibold">
                    {leader.name} {leader.badge}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {leader.score.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">QUACK pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfKwak;
