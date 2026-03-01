import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Search, MapPin, Filter } from "lucide-react";

const DUCK_DATABASE = [
  { id: "DUCK-001", name: "Quacky McQuackface", rarity: "Common", zone: "Beach Cove", owner: "QuackMaster9000", emoji: "🦆" },
  { id: "DUCK-042", name: "Golden Quacker", rarity: "Legendary", zone: "Jeep Depot", owner: "IslandBoss", emoji: "👑" },
  { id: "DUCK-017", name: "Surf Duck", rarity: "Rare", zone: "Lagoon", owner: "WaveRider", emoji: "🌊" },
  { id: "DUCK-099", name: "Alpine Explorer", rarity: "Epic", zone: "Mountain Pass", owner: "PeakHunter", emoji: "⛰️" },
  { id: "DUCK-123", name: "Jungle Jake", rarity: "Uncommon", zone: "Jungle Trail", owner: "TreeClimber", emoji: "🌿" },
  { id: "DUCK-200", name: "Volcano Vince", rarity: "Legendary", zone: "Volcano Peak", owner: "FireWalker", emoji: "🌋" },
];

const rarityColors: Record<string, string> = {
  Common: "bg-gray-100 text-gray-800",
  Uncommon: "bg-green-100 text-green-800",
  Rare: "bg-blue-100 text-blue-800",
  Epic: "bg-purple-100 text-purple-800",
  Legendary: "bg-yellow-100 text-yellow-800",
};

const DuckSearch = () => {
  const [query, setQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState("All");
  const navigate = useNavigate();

  const filtered = DUCK_DATABASE.filter(duck => {
    const matchQuery =
      duck.name.toLowerCase().includes(query.toLowerCase()) ||
      duck.id.toLowerCase().includes(query.toLowerCase()) ||
      duck.zone.toLowerCase().includes(query.toLowerCase()) ||
      duck.owner.toLowerCase().includes(query.toLowerCase());
    const matchRarity = filterRarity === "All" || duck.rarity === filterRarity;
    return matchQuery && matchRarity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl mb-6">Duck Search 🔍</h1>

        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, zone, or owner..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-9 border-4 border-outline"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Common", "Uncommon", "Rare", "Epic", "Legendary"].map(r => (
              <Button
                key={r}
                variant={filterRarity === r ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRarity(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <span className="text-5xl block mb-3">🤷</span>
              No ducks found matching your search.
            </div>
          ) : (
            filtered.map(duck => (
              <div
                key={duck.id}
                className="card-tropical bg-card p-4 flex items-center gap-4 hover-lift cursor-pointer"
                onClick={() => navigate(`/duck/${duck.id}`)}
              >
                <span className="text-4xl">{duck.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl">{duck.name}</span>
                    <Badge className={rarityColors[duck.rarity]}>{duck.rarity}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{duck.id}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{duck.zone}
                    </span>
                    <span>Owner: {duck.owner}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DuckSearch;
