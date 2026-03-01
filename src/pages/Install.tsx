import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Smartphone, Monitor, Apple, Chrome } from "lucide-react";
import { Link } from "react-router-dom";

type DeviceType = "ios" | "android" | "desktop" | "unknown";

const Install = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>("unknown");
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect device type
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType("ios");
    } else if (/android/.test(ua)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Listen for PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const steps = {
    ios: [
      { step: 1, icon: "⬆️", text: "Tik op de Deel-knop (vakje met pijl omhoog) onderaan Safari" },
      { step: 2, icon: "➕", text: "Scroll naar beneden en tik op 'Zet op beginscherm'" },
      { step: 3, icon: "✅", text: "Tik op 'Voeg toe' rechtsboven" },
      { step: 4, icon: "🦆", text: "JeepDuckIsland staat nu op je beginscherm!" },
    ],
    android: [
      { step: 1, icon: "⋮", text: "Tik op de 3 puntjes (menu) rechtsboven in Chrome" },
      { step: 2, icon: "➕", text: "Tik op 'Toevoegen aan startscherm'" },
      { step: 3, icon: "✅", text: "Tik op 'Toevoegen' in het pop-upvenster" },
      { step: 4, icon: "🦆", text: "JeepDuckIsland staat nu op je startscherm!" },
    ],
    desktop: [
      { step: 1, icon: "💻", text: "Klik op het installatie-icoontje in de adresbalk (Chrome/Edge)" },
      { step: 2, icon: "➕", text: "Klik op 'Installeren' in het pop-upvenster" },
      { step: 3, icon: "✅", text: "De app wordt geïnstalleerd als desktopapp" },
      { step: 4, icon: "🦆", text: "JeepDuckIsland staat nu in je apps!" },
    ],
    unknown: [
      { step: 1, icon: "🌐", text: "Open deze pagina in Chrome of Safari" },
      { step: 2, icon: "⋮", text: "Zoek de optie 'Toevoegen aan startscherm' of 'Installeren'" },
      { step: 3, icon: "✅", text: "Volg de instructies om de app te installeren" },
      { step: 4, icon: "🦆", text: "JeepDuckIsland staat nu op je apparaat!" },
    ],
  };

  const deviceIcon = {
    ios: <Apple className="h-8 w-8" />,
    android: <Smartphone className="h-8 w-8" />,
    desktop: <Monitor className="h-8 w-8" />,
    unknown: <Chrome className="h-8 w-8" />,
  };

  const deviceName = {
    ios: "iPhone / iPad",
    android: "Android",
    desktop: "Desktop",
    unknown: "Jouw apparaat",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-bold">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Terug
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-lg mx-auto">
          {/* Header Card */}
          <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center mb-6">
            <div className="text-6xl mb-4">📲</div>
            <h1 className="font-display text-5xl text-foreground mb-2">Installeer de App</h1>
            <p className="text-muted-foreground">
              Voeg JeepDuckIsland toe aan je startscherm voor de beste ervaring!
            </p>
          </div>

          {/* Device Detection */}
          <div className="bg-card rounded-2xl p-6 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-center gap-3 mb-4">
              {deviceIcon[deviceType]}
              <div>
                <p className="font-display text-xl">Gedetecteerd: {deviceName[deviceType]}</p>
                <p className="text-sm text-muted-foreground">Instructies zijn aangepast voor jouw apparaat</p>
              </div>
            </div>

            {/* Install Button for Android/Desktop */}
            {isInstallable && (
              <Button
                onClick={handleInstall}
                className="w-full font-display text-xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mb-4"
              >
                <Download className="mr-2 h-6 w-6" />
                Installeer Nu!
              </Button>
            )}
          </div>

          {/* Steps */}
          <div className="bg-card rounded-2xl p-6 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display text-2xl mb-4">Stap voor stap:</h2>
            <div className="space-y-4">
              {steps[deviceType].map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary border-4 border-foreground flex items-center justify-center font-display text-xl text-primary-foreground flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <span className="text-2xl">{step.icon}</span>
                    <p className="text-foreground">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
