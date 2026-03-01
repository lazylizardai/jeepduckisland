import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import Partners from "@/components/Partners";
import HowItWorks from "@/components/HowItWorks";
import IslandMap from "@/components/IslandMap";
import DuckFeed from "@/components/DuckFeed";
import DuckRarity from "@/components/DuckRarity";
import DuckChain from "@/components/DuckChain";
import DuckPulse from "@/components/DuckPulse";
import HallOfKwak from "@/components/HallOfKwak";
import DuckBadges from "@/components/DuckBadges";
import DuckGames from "@/components/DuckGames";
import DuckShop from "@/components/DuckShop";
import TrackDuck from "@/components/TrackDuck";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <Partners />
      <HowItWorks />
      <IslandMap />
      <DuckFeed />
      <DuckRarity />
      <DuckChain />
      <DuckPulse />
      <HallOfKwak />
      <DuckBadges />
      <DuckGames />
      <DuckShop />
      <TrackDuck />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
