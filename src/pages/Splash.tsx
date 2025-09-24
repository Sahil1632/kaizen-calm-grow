import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import kaizenPlant from "@/assets/kaizen-plant.jpg";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
        <div className="mb-8">
          <img 
            src={kaizenPlant} 
            alt="Kaizen plant logo" 
            className="w-24 h-24 mx-auto mb-4 animate-breathe"
          />
          <h1 className="text-3xl font-bold text-growth mb-2">Kaizen</h1>
          <p className="text-zen">Grow at your own pace</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/onboarding")}
            className="w-full bg-gradient-growth text-primary-foreground shadow-soft hover:shadow-focus transition-all duration-300"
            size="lg"
          >
            Continue with Google
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/onboarding")}
            className="w-full border-primary text-primary hover:bg-primary/10"
            size="lg"
          >
            Continue as Guest
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          Guest data stored locally with option to sync later
        </p>
      </Card>
    </div>
  );
};

export default Splash;