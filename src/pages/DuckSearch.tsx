import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, QrCode } from "lucide-react";
import quackyJack from "@/assets/quacky-jack.png";

const DuckSearch = () => {
  const [duckId, setDuckId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateDuckId = (id: string): boolean => {
    const pattern = /^QJ-\d{4}$/i;
    return pattern.test(id.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = duckId.trim().toUpperCase();
    
    if (!trimmedId) {
      setError("Voer een Duck ID in");
      return;
    }
    
    // Format to QJ-XXXX if user just entered numbers
    let formattedId = trimmedId;
    if (/^\d{4}$/.test(trimmedId)) {
      formattedId = `QJ-${trimmedId}`;
    } else if (/^QJ\d{4}$/i.test(trimmedId)) {
      formattedId = `QJ-${trimmedId.slice(2)}`;
    }
    
    if (!validateDuckId(formattedId)) {
      setError("Ongeldig formaat. Gebruik QJ-0001 t/m QJ-9999");
      return;
    }
    
    setError("");
    navigate(`/duck/${formattedId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-bold">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Terug naar Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Main Card */}
          <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/30 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              {/* Duck Image */}
              <div className="flex justify-center mb-6">
                <img 
                  src={quackyJack} 
                  alt="Quacky Jack" 
                  className="w-28 h-28 object-contain animate-float drop-shadow-xl"
                />
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-6xl text-card text-outline-thick mb-4 text-center transform -rotate-1">
                Zoek je Duck 🔍
              </h1>
              
              <p className="text-center text-muted-foreground mb-8">
                Voer de Duck ID in van je kaartje om de DuckChain te bekijken
              </p>

              {/* Search Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Bijv. QJ-0421"
                    value={duckId}
                    onChange={(e) => {
                      setDuckId(e.target.value.toUpperCase());
                      setError("");
                    }}
                    className="w-full text-xl py-6 border-4 border-foreground font-display text-center uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-background"
                  />
                  {error && (
                    <p className="text-coral text-sm mt-2 text-center font-medium">{error}</p>
                  )}
                </div>
                
                <Button 
                  type="submit"
                  className="w-full font-display text-xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Bekijk DuckChain
                </Button>
              </form>

              {/* QR Hint */}
              <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
                <QrCode className="h-4 w-4" />
                <span className="text-sm">Of scan de QR op je kaartje</span>
              </div>

              {/* Example Links */}
              <div className="mt-8 pt-6 border-t-2 border-foreground/10">
                <p className="text-center text-sm text-muted-foreground mb-3">Probeer een voorbeeld:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link 
                    to="/duck/QJ-0001" 
                    className="font-display text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  >
                    QJ-0001
                  </Link>
                  <Link 
                    to="/duck/QJ-0002" 
                    className="font-display text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  >
                    QJ-0002
                  </Link>
                  <Link 
                    to="/duck/QJ-0003" 
                    className="font-display text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  >
                    QJ-0003
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuckSearch;
