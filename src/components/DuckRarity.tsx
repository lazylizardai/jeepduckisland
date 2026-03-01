import { Badge } from "@/components/ui/badge";

const rarities = [
  {
    name: "Common",
    color: "bg-gray-200 text-gray-800",
    chance: "60%",
    example: "Mallard Duck",
    emoji: "🦆",
  },
  {
    name: "Uncommon",
    color: "bg-green-200 text-green-800",
    chance: "25%",
    example: "Teal Wing",
    emoji: "🦢",
  },
  {
    name: "Rare",
    color: "bg-blue-200 text-blue-800",
    chance: "10%",
    example: "Surf Duck",
    emoji: "🐦",
  },
  {
    name: "Epic",
    color: "bg-purple-200 text-purple-800",
    chance: "4%",
    example: "Alpine Duck",
    emoji: "✨",
  },
  {
    name: "Legendary",
    color: "bg-yellow-200 text-yellow-800",
    chance: "1%",
    example: "Golden Quacker",
    emoji: "👑",
  },
];

const DuckRarity = () => {
  return (
    <section id="rarity" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Duck Rarity</h2>
        <p className="text-center text-gray-600 mb-12">
          Different ducks have different rarities — the rarer the duck, the
          bigger the reward!
        </p>
        <div className="max-w-2xl mx-auto space-y-4">
          {rarities.map((rarity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{rarity.emoji}</span>
                <div>
                  <Badge className={rarity.color}>{rarity.name}</Badge>
                  <p className="text-sm text-gray-600 mt-1">{rarity.example}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{rarity.chance}</p>
                <p className="text-xs text-gray-500">spawn chance</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckRarity;
