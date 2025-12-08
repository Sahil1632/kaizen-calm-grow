import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap, Target, Brain, Crown } from "lucide-react";
import kaizenLogo from "@/assets/kaizen-logo.png";
import heroAnime from "@/assets/hero-anime-focus.webp";

const Home = () => {
  const [purpose, setPurpose] = useState("");
  const [energy, setEnergy] = useState("");
  const [hasReflectionToday, setHasReflectionToday] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedPurpose = localStorage.getItem("kaizen-purpose") || "";
    const savedEnergy = localStorage.getItem("kaizen-energy") || "";
    setPurpose(savedPurpose);
    setEnergy(savedEnergy);
  }, []);

  useEffect(() => {
    const reflections = JSON.parse(localStorage.getItem("kaizen-reflections") || "[]");
    const today = new Date().toISOString().slice(0, 10);
    setHasReflectionToday(reflections.some((r: any) => r.date === today));
  }, []);

  const energyEmojis: Record<string, string> = {
    drained: "😴",
    low: "🌙", 
    balanced: "⚖️",
    focused: "🎯",
    peak: "⚡"
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-6 pb-24">
      <div className="max-w-md mx-auto pt-8">
        {/* Header with Streaks, Kaizen Plus, and XP */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 bg-card/60 backdrop-blur-sm px-3 py-2 rounded-full shadow-soft">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold text-growth">7 days</span>
          </div>
          
          {/* Kaizen Plus Banner */}
          <Button
            onClick={() => navigate("/subscription")}
            variant="ghost"
            className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 hover:from-yellow-400/30 hover:to-orange-400/30 px-3 py-2 rounded-full shadow-soft border border-yellow-400/30"
          >
            <Crown className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">Plus</span>
          </Button>
          
          <div className="flex items-center space-x-2 bg-card/60 backdrop-blur-sm px-3 py-2 rounded-full shadow-soft">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-semibold text-growth">245 XP</span>
          </div>
        </div>

        {/* Logo and Greeting */}
        <div className="text-center mb-8 animate-fade-in">
          <img src={kaizenLogo} alt="Kaizen logo" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-soft" />
          <h1 className="text-2xl font-medium text-growth mb-2">Welcome back</h1>
          {purpose && (
            <p className="text-zen text-sm bg-card/50 p-3 rounded-lg border border-primary/20">
              "{purpose.slice(0, 80)}{purpose.length > 80 ? "..." : ""}"
            </p>
          )}
        </div>
        <img src={heroAnime} alt="Anime productivity hero" loading="lazy" className="w-full h-40 object-cover rounded-2xl shadow-soft mb-6" />
        {!hasReflectionToday && (
          <Card className="p-4 mb-6 bg-card shadow-soft rounded-2xl border border-primary/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Evening reflection</h3>
                <p className="text-sm text-muted-foreground">Jot down thoughts to clear your mind</p>
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" onClick={() => navigate("/reflect")}>
                Reflect
              </Button>
            </div>
          </Card>
        )}

        {/* Progress Bar */}
        <Card className="p-5 mb-6 bg-gradient-zen shadow-soft rounded-2xl border-0 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-foreground">Today's Progress</h3>
            <span className="text-sm text-muted-foreground">3/5 milestones</span>
          </div>
          <div className="w-full bg-background/30 rounded-full h-3 mb-3 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500" style={{width: '60%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>🎯 Task completed: 2</span>
            <span>✨ Streak: 7 days</span>
          </div>
        </Card>

        {/* Energy Status */}
        <Card className="p-5 mb-6 bg-card shadow-soft rounded-2xl border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-zen flex items-center justify-center text-2xl">
                {energyEmojis[energy] || "⚖️"}
              </div>
              <div>
                <div className="font-medium text-foreground">Energy: {energy || "Balanced"}</div>
                <div className="text-sm text-muted-foreground">Tap to update</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/energy")}
              className="text-primary hover:bg-primary/10 rounded-full w-10 h-10 p-0"
            >
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Today's Quest */}
        <Card className="p-6 mb-6 bg-gradient-zen shadow-soft rounded-2xl border-0 animate-fade-in">
          <h2 className="text-xl font-medium text-foreground mb-2">Today's Quest</h2>
          <p className="text-muted-foreground mb-6">Ready to take a mindful step forward?</p>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate("/quick-start")}
              variant="ghost"
              className="w-full bg-background text-foreground hover:bg-muted shadow-soft transition-all duration-300 rounded-xl h-14 text-base font-medium border border-border"
              size="lg"
            >
              <Target className="w-5 h-5 mr-3" />
              Quick Start
            </Button>

            <Button
              onClick={() => navigate("/smart-guidance")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-14 text-base font-medium shadow-[0_0_20px_hsl(var(--primary)/0.4),0_0_40px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5),0_0_50px_hsl(var(--primary)/0.3)] transition-all duration-300 animate-pulse-glow"
              size="lg"
            >
              <Brain className="w-5 h-5 mr-3" />
              Smart Guidance
            </Button>
          </div>
        </Card>

        {/* Breathing Space */}
        <div className="text-center text-muted-foreground text-sm">
          Take your time. Growth happens at your own pace.
        </div>
      </div>
    </div>
  );
};

export default Home;