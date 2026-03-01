import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Camera, MessageSquare, ArrowLeft, CheckCircle } from "lucide-react";
import quackyJack from "@/assets/quacky-jack.png";
import UploadDuckShotModal from "@/components/UploadDuckShotModal";

const TouristScan = () => {
  const { duckId } = useParams();
  const [sightingNote, setSightingNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleSightingSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("duck_sightings")
        .insert({
          duck_id: duckId,
          note: sightingNote,
          location_name: "Jeep Duck Island",
        });

      if (error) throw error;
      
      setSubmitted(true);
      toast.success("Waarneming opgeslagen!");
    } catch (error: any) {
      toast.error("Er ging iets mis: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="font-display text-4xl mb-4">Bedankt!</h2>
          <p className="text-muted-foreground mb-6">
            Je waarneming van eend {duckId} is opgeslagen in de DuckChain!
          </p>
          <div className="flex gap-3 justify-center">
            <Link to={`/duck/${duckId}`}>
              <Button className="font-display border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Bekijk DuckChain
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="font-display border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-bold">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Terug naar Home
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Duck Card */}
          <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-4xl">Eend gevonden!</h1>
                <p className="text-muted-foreground">Duck ID: <span className="font-display text-primary">{duckId}</span></p>
              </div>
              <img src={quackyJack} alt="Duck" className="w-20 h-20 animate-bounce" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => setShowUploadModal(true)}
                variant="outline"
                className="font-display text-lg py-5 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Camera className="mr-2 h-5 w-5" />
                Upload een foto
              </Button>
            </div>
          </div>

          {/* Sighting Form */}
          <div className="bg-card rounded-3xl p-6 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Voeg een notitie toe
            </h2>

            <Textarea
              placeholder="Waar heb je de eend gevonden? Vertel je verhaal..."
              value={sightingNote}
              onChange={(e) => setSightingNote(e.target.value)}
              className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4"
              rows={4}
            />

            <Button
              onClick={handleSightingSubmit}
              disabled={isSubmitting}
              className="w-full font-display text-xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <MapPin className="mr-2 h-5 w-5" />
              {isSubmitting ? "Opslaan..." : "Meld waarneming"}
            </Button>
          </div>
        </div>
      </div>

      <UploadDuckShotModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        duckId={duckId || ""}
      />
    </div>
  );
};

export default TouristScan;
