import { MapPin } from "lucide-react";

const zones = [
  { name: "Beach Cove", ducks: 45, color: "bg-blue-100", emoji: "🏖️" },
  { name: "Jungle Trail", ducks: 32, color: "bg-green-100", emoji: "🌿" },
  { name: "Mountain Pass", ducks: 18, color: "bg-gray-100", emoji: "⛰️" },
  { name: "Jeep Depot", ducks: 67, color: "bg-yellow-100", emoji: "🚙" },
  { name: "Lagoon", ducks: 29, color: "bg-teal-100", emoji: "💧" },
  { name: "Volcano Peak", ducks: 8, color: "bg-red-100", emoji: "🌋" },
];

const IslandMap = () => {
  return (
    <section id="map" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Island Map</h2>
        <p className="text-center text-gray-600 mb-12">
          Explore all zones and find where the ducks are hiding
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {zones.map((zone, index) => (
            <div
              key={index}
              className={`${zone.color} rounded-xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer`}
            >
              <span className="text-4xl mb-3">{zone.emoji}</span>
              <h3 className="font-semibold mb-1">{zone.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{zone.ducks} ducks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IslandMap;
