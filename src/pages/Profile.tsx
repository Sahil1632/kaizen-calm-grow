import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    goals: "",
    workingStyle: "",
    motivation: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem("kaizen-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("kaizen-profile", JSON.stringify(profile));
    navigate("/home");
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <h1 className="text-xl font-bold text-growth">Profile</h1>
        </div>

        <Card className="p-6 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center mb-6">
            <User className="w-12 h-12 mx-auto mb-3 text-primary animate-breathe" />
            <h2 className="text-lg font-bold text-growth mb-2">Personalize Your Journey</h2>
            <p className="text-zen">Help us tailor Kaizen to your unique style</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-growth">Name (optional)</Label>
              <Input
                id="name"
                placeholder="What should we call you?"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-growth">Goals or interests</Label>
              <Textarea
                id="goals"
                placeholder="Writing, coding, reading, learning Spanish..."
                value={profile.goals}
                onChange={(e) => updateProfile("goals", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workingStyle" className="text-growth">Working style preference</Label>
              <Input
                id="workingStyle"
                placeholder="Short bursts, long sessions, morning person..."
                value={profile.workingStyle}
                onChange={(e) => updateProfile("workingStyle", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="motivation" className="text-growth">What motivates you?</Label>
              <Textarea
                id="motivation"
                placeholder="Progress tracking, gentle reminders, achieving goals..."
                value={profile.motivation}
                onChange={(e) => updateProfile("motivation", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-growth text-primary-foreground shadow-soft hover:shadow-focus transition-all duration-300"
                size="lg"
              >
                Save Profile
              </Button>
              
              <p className="text-xs text-center text-zen mt-3">
                All information is stored locally and private to you
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Settings */}
        <Card className="p-4 mt-4 shadow-zen bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-growth">Settings</div>
                <div className="text-xs text-zen">Notifications, themes, data</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Manage
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;