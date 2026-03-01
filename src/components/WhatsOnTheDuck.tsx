import { QrCode, Tag, Sparkles } from "lucide-react";

const WhatsOnTheDuck = () => {
  return (
    <section id="whats-on-duck" className="py-20 gradient-sunset relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-7xl opacity-20 animate-wiggle-slow">🏷️</div>
      <div className="absolute bottom-10 left-10 text-7xl opacity-20 animate-float">📱</div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-5xl md:text-7xl text-card text-outline-thick mb-4 inline-block transform -rotate-1 hover:rotate-1 transition-transform">
            Wat zit er op de Duck? 🏷️
          </h2>
          <p className="font-body text-xl text-card/90 max-w-2xl mx-auto">
            Elke duck komt met een uniek kaartje. Scan, claim, en deel de vreugde!
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          {/* Visual Duck Card */}
          <div className="card-tropical bg-duck-yellow p-8 relative overflow-hidden hover-lift">
            {/* Duck card mockup */}
            <div className="bg-card rounded-3xl border-[5px] border-outline p-6 shadow-cartoon-lg relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-duck-yellow rounded-2xl border-4 border-outline flex items-center justify-center">
                    <span className="text-3xl">🦆</span>
                  </div>
                  <div>
                    <p className="font-display text-2xl">Quacky #0042</p>
                    <p className="font-body text-sm text-muted-foreground">JeepDuck Island</p>
                  </div>
                </div>
                <div className="badge-rarity-legendary">⭐ Legendary</div>
              </div>
              
              {/* QR Code placeholder */}
              <div className="bg-muted rounded-2xl border-4 border-outline p-4 flex items-center justify-center mb-6">
                <div className="text-center">
                  <QrCode className="w-24 h-24 mx-auto text-foreground" />
                  <p className="font-body text-sm mt-2 text-muted-foreground">Scan om te claimen!</p>
                </div>
              </div>
              
              {/* Info rows */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border-2 border-outline/30">
                  <Tag className="w-5 h-5 text-duck-orange" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Duck Naam</p>
                    <p className="font-display text-lg">Quacky McQuackface</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3 border-2 border-outline/30">
                  <Sparkles className="w-5 h-5 text-duck-yellow" />
                  <div>
                    <p className="font-body text-xs text-muted-foreground">Boodschap</p>
                    <p className="font-display text-lg">"Quack is the new black!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Explanation */}
          <div className="space-y-6">
            <div className="card-tropical bg-card p-6 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-duck-yellow rounded-2xl border-4 border-outline flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-2">Het Kaartje</h3>
                  <p className="font-body text-muted-foreground">
                    Elke JeepDuck heeft een uniek fysiek kaartje met naam, nummer en speciale boodschap.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-tropical bg-card p-6 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-duck-orange rounded-2xl border-4 border-outline flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-card" />
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-2">De QR Code</h3>
                  <p className="font-body text-muted-foreground">
                    Scan de QR code om de duck te registreren in je digitale collectie op JeepDuck Island.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-tropical bg-card p-6 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-duck-teal rounded-2xl border-4 border-outline flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-card" />
                </div>
                <div>
                  <h3 className="font-display text-2xl mb-2">De Boodschap</h3>
                  <p className="font-body text-muted-foreground">
                    Elke duck draagt een unieke boodschap mee — van grappig tot inspirerend!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsOnTheDuck;
