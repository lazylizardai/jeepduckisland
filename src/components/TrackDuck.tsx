import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const mockDucks = {
  "DUCK-001": {
    name: "Golden Quacker",
    rarity: "Legendary",
    location: "Jeep Depot",
    owner: "QuackMaster9000",
    minted: "Jan 15, 2024",
  },
  "DUCK-042": {
    name: "Surf Duck",
    rarity: "Rare",
    location: "Beach Cove",
    owner: "IslandExplorer",
    minted: "Feb 3, 2024",
  },
};

const TrackDuck = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | (typeof mockDucks)[keyof typeof mockDucks]>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = mockDucks[query.toUpperCase() as keyof typeof mockDucks];
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  return (
    <section id="track" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Track a Duck</h2>
        <p className="text-center text-gray-600 mb-12">
          Enter a duck ID to see its full history and current owner
        </p>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Enter Duck ID (e.g. DUCK-001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>
          {result && (
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{result.name}</h3>
                <Badge>{result.rarity}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span>{result.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner:</span>
                  <span>{result.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Minted:</span>
                  <span>{result.minted}</span>
                </div>
              </div>
            </div>
          )}
          {notFound && (
            <p className="text-center text-red-500">Duck not found. Try DUCK-001 or DUCK-042.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrackDuck;
