import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Check, Star, Zap, Brain, Heart } from "lucide-react";

const Subscription = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, text: "Advanced AI guidance & personalization" },
    { icon: Zap, text: "Unlimited smart milestones & breakdowns" },
    { icon: Star, text: "Priority focus sounds & ambient tracks" },
    { icon: Heart, text: "Advanced progress analytics & insights" },
    { text: "Export your growth data & achievements" },
    { text: "Early access to new features" },
    { text: "Priority customer support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-growth">Kaizen Plus</h1>
        </div>

        {/* Hero Section */}
        <Card className="p-6 mb-6 text-center shadow-zen bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 animate-fade-in">
          <div className="text-4xl mb-4 animate-breathe">👑</div>
          <h2 className="text-xl font-bold text-growth mb-2">Unlock Your Full Potential</h2>
          <p className="text-zen text-sm">Advanced features to supercharge your growth journey</p>
        </Card>

        {/* Features List */}
        <Card className="p-6 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
          <h3 className="font-semibold text-growth mb-4">What you'll get:</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  {feature.icon ? (
                    <feature.icon className="w-3 h-3 text-primary" />
                  ) : (
                    <Check className="w-3 h-3 text-primary" />
                  )}
                </div>
                <span className="text-sm text-foreground">{feature.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing Plans */}
        <div className="space-y-4 mb-6">
          {/* Monthly Plan */}
          <Card className="p-5 shadow-zen bg-card/80 backdrop-blur-sm border border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-growth">Monthly Plan</h3>
                <p className="text-xs text-zen">Perfect for trying out Plus features</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">₹150</div>
                <div className="text-xs text-muted-foreground">/month</div>
              </div>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold"
            >
              Start Monthly Plan
            </Button>
          </Card>

          {/* Yearly Plan - Most Popular */}
          <Card className="p-5 shadow-zen bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/40 relative">
            <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1">
              Most Popular
            </Badge>
            <div className="flex items-center justify-between mb-3 mt-2">
              <div>
                <h3 className="font-semibold text-growth">Yearly Plan</h3>
                <p className="text-xs text-zen">Best value - save big!</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">₹999</div>
                <div className="text-xs text-muted-foreground">/year</div>
                <div className="text-xs text-green-600 font-medium">Save ₹801!</div>
              </div>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 font-semibold"
            >
              Start Yearly Plan ✨
            </Button>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center space-y-3 mb-6">
          <p className="text-xs text-muted-foreground">
            ✓ Cancel anytime • ✓ Secure payments • ✓ 7-day free trial
          </p>
          <p className="text-xs text-zen">
            Join thousands of users already growing with Kaizen Plus
          </p>
        </div>

        {/* Back to Free Version */}
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="w-full text-muted-foreground"
        >
          Continue with Free Version
        </Button>
      </div>
    </div>
  );
};

export default Subscription;