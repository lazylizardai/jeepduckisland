import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Download, Smartphone, Monitor, Chrome, Apple, Globe } from "lucide-react";

const Install = () => {
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const steps = [
    {
      platform: "Android (Chrome)",
      icon: Chrome,
      color: "text-green-500",
      bg: "bg-green-50",
      steps: [
        "Open JeepDuck Island in Chrome",
        "Tap the menu (three dots) in the top right",
        "Select 'Add to Home screen'",
        "Confirm by tapping 'Add'",
      ],
    },
    {
      platform: "iOS (Safari)",
      icon: Apple,
      color: "text-gray-700",
      bg: "bg-gray-50",
      steps: [
        "Open JeepDuck Island in Safari",
        "Tap the Share button (square with arrow)",
        "Scroll down and tap 'Add to Home Screen'",
        "Tap 'Add' to confirm",
      ],
    },
    {
      platform: "Desktop (Chrome/Edge)",
      icon: Monitor,
      color: "text-blue-500",
      bg: "bg-blue-50",
      steps: [
        "Open JeepDuck Island in Chrome or Edge",
        "Look for the install icon in the address bar",
        "Click 'Install' when prompted",
        "Or use the button below if available",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce">🦆</div>
          <h1 className="font-display text-5xl mb-3">Install the App</h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the full JeepDuck Island experience by installing the app on your device!
          </p>
        </div>

        {/* Install button for supported browsers */}
        <div className="card-tropical bg-duck-yellow p-8 text-center mb-8">
          <Smartphone className="w-12 h-12 mx-auto mb-4 text-black" />
          <h2 className="font-display text-3xl mb-3">Quick Install</h2>
          <p className="font-body mb-6 text-black/80">
            If your browser supports it, click below to install directly!
          </p>
          {installed ? (
            <div className="font-display text-2xl text-green-700">
              ✅ App Installed! Check your home screen.
            </div>
          ) : (
            <Button
              onClick={handleInstall}
              className="btn-primary text-lg px-8 py-4"
              disabled={!deferredPrompt}
            >
              <Download className="w-5 h-5 mr-2" />
              {deferredPrompt ? "Install App" : "Follow steps below to install"}
            </Button>
          )}
        </div>

        {/* Platform instructions */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((platform, i) => (
            <div key={i} className="card-tropical bg-card p-6">
              <div className={`w-12 h-12 ${platform.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <platform.icon className={`w-6 h-6 ${platform.color}`} />
              </div>
              <h3 className="font-display text-xl mb-4">{platform.platform}</h3>
              <ol className="space-y-3">
                {platform.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 font-body text-sm">
                    <span className="w-6 h-6 bg-duck-yellow rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="card-tropical bg-card p-6 mt-8">
          <h2 className="font-display text-2xl mb-4">Why Install?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: "⚡", title: "Faster", desc: "Loads instantly, even offline" },
              { emoji: "🔔", title: "Notifications", desc: "Get alerts for rare ducks" },
              { emoji: "📱", title: "Native Feel", desc: "Full screen, no browser bar" },
            ].map((benefit, i) => (
              <div key={i} className="text-center p-4 bg-muted rounded-2xl">
                <div className="text-3xl mb-2">{benefit.emoji}</div>
                <div className="font-display text-lg">{benefit.title}</div>
                <div className="font-body text-sm text-muted-foreground">{benefit.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Install;
