import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Spot the Duck",
    description:
      "Find a JeepDuck in the wild or online and take a photo of it.",
  },
  {
    number: "02",
    title: "Scan & Verify",
    description:
      "Use our app to scan the duck's unique code and verify its authenticity.",
  },
  {
    number: "03",
    title: "Mint Your NFT",
    description:
      "Your verified duck sighting automatically mints as an NFT on the blockchain.",
  },
  {
    number: "04",
    title: "Earn & Trade",
    description:
      "Collect points, earn badges, and trade your duck NFTs in the marketplace.",
  },
];

const DuckChain = () => {
  return (
    <section id="duckchain" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">The Duck Chain</h2>
        <p className="text-center text-gray-600 mb-12">
          From physical duck to digital asset in 4 simple steps
        </p>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border max-w-xs">
                <span className="text-4xl font-bold text-yellow-400 mb-3">
                  {step.number}
                </span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-6 h-6 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckChain;
