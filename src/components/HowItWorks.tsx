import { Search, Scan, Coins, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Spot a Duck",
    description:
      "Find JeepDucks hidden around the island or discover them online in our virtual island.",
    step: "1",
  },
  {
    icon: Scan,
    title: "Scan & Verify",
    description:
      "Use the JeepDuck app to scan the unique QR code on each duck to verify its authenticity.",
    step: "2",
  },
  {
    icon: Coins,
    title: "Earn QUACK",
    description:
      "Every verified duck sighting earns you QUACK tokens that you can use in our ecosystem.",
    step: "3",
  },
  {
    icon: Trophy,
    title: "Win Prizes",
    description:
      "Compete in weekly contests and monthly championships to win exclusive prizes and NFTs.",
    step: "4",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-12">
          Join thousands of duck hunters and start your journey today
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
