import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UploadDuckShotModal from "./UploadDuckShotModal";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 pt-16"
    >
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-yellow-100 text-yellow-800 text-sm px-4 py-1">
          🦆 Welcome to JeepDuck Island
        </Badge>
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Spot Ducks.
          <br />
          <span className="text-yellow-500">Earn Rewards.</span>
          <br />
          Own the Island.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join thousands of hunters tracking JeepDucks across the island. Spot
          them, scan them, mint them as NFTs, and earn QUACK tokens.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4">
            Start Hunting
          </Button>
          <UploadDuckShotModal />
        </div>
        <div className="mt-16 text-8xl animate-bounce">🦆</div>
      </div>
    </section>
  );
};

export default HeroSection;
