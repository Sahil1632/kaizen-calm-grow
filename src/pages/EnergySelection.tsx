import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import OnboardingBackground from "@/components/OnboardingBackground";

const energyLevels = [
  { id: "peak", label: "Peak", emoji: "⚡", description: "Full energy mode" },
  { id: "focused", label: "Focused", emoji: "🎯", description: "Ready to dive deep" },
  { id: "balanced", label: "Balanced", emoji: "⚖️", description: "Steady and centered" },
  { id: "low", label: "Low", emoji: "🌙", description: "Taking it slow today" },
  { id: "drained", label: "Drained", emoji: "😴", description: "Need gentle recovery" }
];

const EnergySelection = () => {
  const [selectedEnergy, setSelectedEnergy] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedEnergy) {
      localStorage.setItem("kaizen-energy", selectedEnergy);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <OnboardingBackground />
      <Card className="w-full max-w-md p-8 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-growth mb-3">Choose your energy level ⚡</h1>
          <p className="text-zen">We'll match your flow to how you're feeling</p>
        </div>

        <div className="space-y-3 mb-8">
          {energyLevels.map((level) => (
            <Button
              key={level.id}
              variant={selectedEnergy === level.id ? "default" : "outline"}
              onClick={() => setSelectedEnergy(level.id)}
              className={`w-full p-4 h-auto text-left justify-start space-x-3 transition-all duration-300 ${
                selectedEnergy === level.id 
                  ? `energy-${level.id} animate-grow shadow-soft` 
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="text-2xl">{level.emoji}</span>
              <div>
                <div className="font-medium">{level.label}</div>
                <div className="text-sm opacity-75">{level.description}</div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedEnergy}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          Set My Flow ✨
        </Button>
      </Card>
    </div>
  );
};

export default EnergySelection;