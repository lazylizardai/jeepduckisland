import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const items = [
  {
    name: "Duck Detector Pro",
    price: "299 QUACK",
    description: "Advanced duck detection with 10x zoom",
    badge: "Best Seller",
    emoji: "🔭",
  },
  {
    name: "Island Pass",
    price: "500 QUACK",
    description: "Unlimited access to all island zones",
    badge: "Premium",
    emoji: "🎫",
  },
  {
    name: "Lucky Duck Charm",
    price: "150 QUACK",
    description: "Increases rare duck spawn rate by 5%",
    badge: "New",
    emoji: "🍀",
  },
  {
    name: "Quack Booster",
    price: "200 QUACK",
    description: "Double your QUACK earnings for 24 hours",
    badge: "Popular",
    emoji: "⚡",
  },
  {
    name: "Duck Disguise Kit",
    price: "100 QUACK",
    description: "Get closer to ducks without spooking them",
    badge: null,
    emoji: "🎭",
  },
  {
    name: "Golden Net",
    price: "750 QUACK",
    description: "Capture legendary ducks with ease",
    badge: "Exclusive",
    emoji: "🥅",
  },
];

const DuckShop = () => {
  const { toast } = useToast();

  const handlePurchase = (itemName: string) => {
    toast({
      title: "Added to Cart!",
      description: `${itemName} has been added to your cart.`,
    });
  };

  return (
    <section id="shop" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Duck Shop</h2>
        <p className="text-center text-gray-600 mb-12">
          Spend your QUACK tokens on tools and power-ups
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{item.emoji}</span>
                {item.badge && (
                  <Badge variant="secondary">{item.badge}</Badge>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-600">{item.price}</span>
                <Button
                  size="sm"
                  onClick={() => handlePurchase(item.name)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DuckShop;
