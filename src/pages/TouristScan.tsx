import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { Camera, QrCode, Upload, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_VALID_CODES = {
  "DUCK-001": { name: "Quacky McQuackface", rarity: "Common", points: 10, emoji: "🦆" },
  "DUCK-042": { name: "Golden Quacker", rarity: "Legendary", points: 500, emoji: "👑" },
  "DUCK-017": { name: "Surf Duck", rarity: "Rare", points: 100, emoji: "🌊" },
  "DUCK-099": { name: "Alpine Explorer", rarity: "Epic", points: 250, emoji: "⛰️" },
};

const rarityColors: Record<string, string> = {
  Common: "bg-gray-100 text-gray-800",
  Uncommon: "bg-green-100 text-green-800",
  Rare: "bg-blue-100 text-blue-800",
  Epic: "bg-purple-100 text-purple-800",
  Legendary: "bg-yellow-100 text-yellow-800",
};

const TouristScan = () => {
  const [scanState, setScanState] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scannedDuck, setScannedDuck] = useState<any>(null);
  const [manualCode, setManualCode] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const processCode = useCallback((code: string) => {
    setScanState("scanning");
    setTimeout(() => {
      const upperCode = code.toUpperCase().trim();
      const duck = MOCK_VALID_CODES[upperCode as keyof typeof MOCK_VALID_CODES];
      if (duck) {
        setScannedDuck({ ...duck, code: upperCode });
        setScanState("success");
        toast({
          title: `Duck found! ${duck.emoji}`,
          description: `${duck.name} - ${duck.rarity} (+${duck.points} pts)`,
        });
      } else {
        setScanState("error");
        toast({
          title: "Invalid code",
          description: "This duck code was not found.",
          variant: "destructive",
        });
      }
    }, 1500);
  }, [toast]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode) processCode(manualCode);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (error) {
      toast({ title: "Camera error", description: "Could not access camera.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const reset = () => {
    setScanState("idle");
    setScannedDuck(null);
    setManualCode("");
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-4xl">Scan Duck QR</h1>
        </div>

        {scanState === "success" && scannedDuck ? (
          <div className="card-tropical bg-card p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <div className="text-6xl mb-4">{scannedDuck.emoji}</div>
            <h2 className="font-display text-3xl mb-2">{scannedDuck.name}</h2>
            <div className="flex justify-center gap-3 mb-6">
              <Badge className={rarityColors[scannedDuck.rarity]}>{scannedDuck.rarity}</Badge>
              <Badge className="bg-duck-yellow text-black">+{scannedDuck.points} pts</Badge>
            </div>
            <p className="font-body text-muted-foreground mb-6">Code: {scannedDuck.code}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} className="btn-primary">Scan Another</Button>
              <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            </div>
          </div>
        ) : scanState === "error" ? (
          <div className="card-tropical bg-card p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="font-display text-3xl mb-2">Invalid Code</h2>
            <p className="font-body text-muted-foreground mb-6">That duck code was not found. Try again!</p>
            <Button onClick={reset} className="btn-primary">Try Again</Button>
          </div>
        ) : scanState === "scanning" ? (
          <div className="card-tropical bg-card p-8 text-center">
            <Loader2 className="w-16 h-16 text-duck-orange mx-auto mb-4 animate-spin" />
            <h2 className="font-display text-2xl">Verifying Duck...</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Camera scan */}
            <div className="card-tropical bg-card p-6">
              <h2 className="font-display text-xl mb-4">Scan QR Code</h2>
              {cameraActive ? (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-outline">
                    <video ref={videoRef} className="w-full" playsInline />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-4 border-duck-yellow rounded-2xl opacity-70" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={stopCamera} variant="outline" className="flex-1">Stop Camera</Button>
                    <Button onClick={() => processCode("DUCK-001")} className="btn-primary flex-1">
                      Simulate Scan
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={startCamera} className="btn-primary w-full text-lg py-4">
                  <Camera className="w-5 h-5 mr-2" /> Open Camera
                </Button>
              )}
            </div>

            {/* Manual entry */}
            <div className="card-tropical bg-card p-6">
              <h2 className="font-display text-xl mb-4">Enter Code Manually</h2>
              <form onSubmit={handleManualSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  placeholder="e.g. DUCK-001"
                  className="flex-1 border-4 border-outline rounded-xl px-4 py-2 font-body text-lg bg-background"
                />
                <Button type="submit" className="btn-primary" disabled={!manualCode}>
                  <QrCode className="w-4 h-4 mr-1" /> Verify
                </Button>
              </form>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Try: DUCK-001, DUCK-042, DUCK-017, DUCK-099
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristScan;
