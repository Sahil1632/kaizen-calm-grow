import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import OnboardingBackground from "@/components/OnboardingBackground";

const Purpose = () => {
  const [purpose, setPurpose] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (purpose.trim()) {
      // Store purpose locally
      localStorage.setItem("kaizen-purpose", purpose);
      navigate("/energy");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <OnboardingBackground />
      <Card className="w-full max-w-md p-8 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4 animate-breathe">🧭</div>
          <h1 className="text-2xl font-bold text-growth mb-3">What truly matters to you?</h1>
          <p className="text-zen">This becomes your compass when things get overwhelming</p>
        </div>

        <div className="space-y-6">
          <Textarea
            placeholder="Write what drives you, what you care about, what you want to grow towards..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && purpose.trim()) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="min-h-32 bg-background/50 border-primary/20 focus:border-primary resize-none"
          />

          <div className="flex items-center justify-center text-xs text-muted-foreground space-x-2">
            <Lock className="w-3 h-3" />
            <span>Private, only you can see this</span>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!purpose.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold disabled:opacity-50"
            size="lg"
          >
            Set my compass ✨
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Purpose;