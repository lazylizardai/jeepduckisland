import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart } from "lucide-react";

const feedItems = [
  {
    id: 1,
    user: "DuckHunter42",
    avatar: "🦆",
    location: "Jeep Trail #7",
    duck: "Golden Quacker",
    rarity: "Legendary",
    likes: 234,
    time: "2 min ago",
    image: "🚙",
  },
  {
    id: 2,
    user: "IslandExplorer",
    avatar: "🌴",
    location: "Beach Cove",
    duck: "Surf Duck",
    rarity: "Rare",
    likes: 89,
    time: "15 min ago",
    image: "🌊",
  },
  {
    id: 3,
    user: "QuackMaster",
    avatar: "⭐",
    location: "Mountain Pass",
    duck: "Alpine Duck",
    rarity: "Epic",
    likes: 156,
    time: "1 hr ago",
    image: "⛰️",
  },
];

const rarityColors: Record<string, string> = {
  Legendary: "bg-yellow-100 text-yellow-800",
  Epic: "bg-purple-100 text-purple-800",
  Rare: "bg-blue-100 text-blue-800",
  Common: "bg-gray-100 text-gray-800",
};

const DuckFeed = () => {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="feed" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Live Duck Feed</h2>
        <p className="text-center text-gray-600 mb-12">
          See what ducks are being spotted right now across the island
        </p>
        <div className="max-w-2xl mx-auto space-y-4">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.avatar}</span>
                  <div>
                    <p className="font-semibold">{item.user}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{item.time}</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-4xl">{item.image}</span>
                <div>
                  <p className="font-medium">{item.duck}</p>
                  <Badge className={rarityColors[item.rarity]}>
                    {item.rarity}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleLike(item.id)}
                  className={liked[item.id] ? "text-red-500" : ""}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      liked[item.id] ? "fill-red-500" : ""
                    }`}
                  />
                  {item.likes + (liked[item.id] ? 1 : 0)}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckFeed;
