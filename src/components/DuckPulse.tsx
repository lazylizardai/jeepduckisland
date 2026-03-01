import { useState, useEffect } from "react";

const stats = [
  { label: "Ducks Spotted Today", value: 1247, suffix: "" },
  { label: "Active Hunters", value: 3891, suffix: "" },
  { label: "QUACK Tokens Earned", value: 52840, suffix: "" },
  { label: "NFTs Minted", value: 9643, suffix: "" },
];

const DuckPulse = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers = stats.map((stat, index) => {
      return setInterval(() => {
        setCounts((prev) => {
          const newCounts = [...prev];
          const increment = stat.value / steps;
          newCounts[index] = Math.min(
            prev[index] + increment,
            stat.value
          );
          return newCounts;
        });
      }, interval);
    });

    setTimeout(() => {
      timers.forEach(clearInterval);
      setCounts(stats.map((s) => s.value));
    }, duration + interval);

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="py-16 bg-yellow-400">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-black">
          Duck Pulse — Live Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-black">
                {Math.round(counts[index]).toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-sm mt-1 text-black/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckPulse;
