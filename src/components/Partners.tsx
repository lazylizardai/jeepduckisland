const partners = [
  { name: "DuckDAO", emoji: "🏛️" },
  { name: "QuackChain", emoji: "⛓️" },
  { name: "Island Labs", emoji: "🧪" },
  { name: "NFT Garage", emoji: "🚗" },
  { name: "Crypto Cove", emoji: "💎" },
  { name: "Web3 Wings", emoji: "🪶" },
];

const Partners = () => {
  return (
    <section className="py-12 bg-gray-50 border-y">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-500 text-sm mb-6">
          Trusted by the best in Web3
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-600 font-medium"
            >
              <span className="text-xl">{partner.emoji}</span>
              <span>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
