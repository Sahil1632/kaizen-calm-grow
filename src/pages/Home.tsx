import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Brain } from "lucide-react";

const Home = () => {
  const [purpose, setPurpose] = useState("");
  const [energy, setEnergy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedPurpose = localStorage.getItem("kaizen-purpose") || "";
    const savedEnergy = localStorage.getItem("kaizen-energy") || "";
    setPurpose(savedPurpose);
    setEnergy(savedEnergy);
  }, []);

  const energyEmojis: Record<string, string> = {
    drained: "😴",
    low: "🌙", 
    balanced: "⚖️",
    focused: "🎯",
    peak: "⚡"
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Greeting */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold text-growth mb-2">Welcome back 🌱</h1>
          {purpose && (
            <p className="text-zen text-sm bg-card/50 p-3 rounded-lg border border-primary/20">
              "{purpose.slice(0, 80)}{purpose.length > 80 ? "..." : ""}"
            </p>
          )}
        </div>

        {/* Energy Status */}
        <Card className="p-4 mb-6 bg-card/80 backdrop-blur-sm shadow-zen">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{energyEmojis[energy] || "⚖️"}</span>
              <div>
                <div className="font-medium text-growth">Energy: {energy || "Balanced"}</div>
                <div className="text-xs text-zen">Tap to update</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/energy")}
              className="text-primary"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Today's Quest */}
        <Card className="p-6 mb-6 bg-gradient-zen shadow-zen animate-fade-in">
          <h2 className="text-lg font-bold text-growth mb-2">Today's Quest</h2>
          <p className="text-zen mb-4">Ready to take a mindful step forward?</p>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/quick-start")}
              className="w-full bg-card text-card-foreground hover:bg-card/90 shadow-soft transition-all duration-300"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Quick Start — add your own task
            </Button>

            <Button
              onClick={() => navigate("/smart-guidance")}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              size="lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Smart Guidance — let Kaizen break it down
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 text-xs">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/growth")}
            className="text-muted-foreground"
          >
            Growth
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-muted-foreground"
          >
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;