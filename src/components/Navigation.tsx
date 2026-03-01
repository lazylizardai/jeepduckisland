import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦆</span>
          <span className="font-bold text-xl">JeepDuck Island</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#how-it-works">How it Works</NavLink>
          <NavLink href="#map">Island Map</NavLink>
          <NavLink href="#feed">Live Feed</NavLink>
          <NavLink href="#leaderboard">Leaderboard</NavLink>
          <NavLink href="#shop">Shop</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </div>
        <Button size="sm">Connect Wallet</Button>
      </div>
    </nav>
  );
};

export default Navigation;
