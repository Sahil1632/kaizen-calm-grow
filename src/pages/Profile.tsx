import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    goals: "",
    workingStyle: "",
    motivation: "",
    avatarUrl: ""
  });
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setProfile({
            name: data.name || "",
            goals: data.goals || "",
            workingStyle: data.working_style || "",
            motivation: data.motivation || "",
            avatarUrl: data.avatar_url || ""
          });
        }
      } else {
        const savedProfile = localStorage.getItem("kaizen-profile");
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: profile.name,
          goals: profile.goals,
          working_style: profile.workingStyle,
          motivation: profile.motivation,
          avatar_url: profile.avatarUrl
        });

      if (error) {
        toast({
          title: "Error saving profile",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Profile saved",
        description: "Your changes have been saved successfully"
      });
    } else {
      localStorage.setItem("kaizen-profile", JSON.stringify(profile));
    }
    navigate("/home");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated"
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4 md:p-6 pb-24">
      <div className="max-w-md mx-auto pt-4 md:pt-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="mr-2 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>

        <Card className="p-6 shadow-zen bg-card/90 backdrop-blur-sm animate-fade-in rounded-3xl">
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name || "User"} />
                <AvatarFallback className="bg-gradient-zen text-2xl">
                  {profile.name?.[0]?.toUpperCase() || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !user}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Personalize Your Journey</h2>
            <p className="text-muted-foreground text-sm">Help us tailor Kaizen to your unique style</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-foreground font-medium">Name (optional)</Label>
              <Input
                id="name"
                placeholder="What should we call you?"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-foreground font-medium">Goals or interests</Label>
              <Textarea
                id="goals"
                placeholder="Writing, coding, reading, learning Spanish..."
                value={profile.goals}
                onChange={(e) => updateProfile("goals", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary resize-none rounded-xl"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="workingStyle" className="text-foreground font-medium">Working style preference</Label>
              <Input
                id="workingStyle"
                placeholder="Short bursts, long sessions, morning person..."
                value={profile.workingStyle}
                onChange={(e) => updateProfile("workingStyle", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="motivation" className="text-foreground font-medium">What motivates you?</Label>
              <Textarea
                id="motivation"
                placeholder="Progress tracking, gentle reminders, achieving goals..."
                value={profile.motivation}
                onChange={(e) => updateProfile("motivation", e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary resize-none rounded-xl"
                rows={3}
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft hover:shadow-zen transition-all duration-300 rounded-full h-12 text-base font-semibold"
                size="lg"
              >
                Save Profile ✨
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                {user ? "Your information is securely stored" : "All information is stored locally and private to you"}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Settings */}
        <Card className="p-4 mt-4 shadow-zen bg-card/90 backdrop-blur-sm rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium text-foreground">Settings</div>
                <div className="text-xs text-muted-foreground">Notifications, themes, data</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary rounded-full">
              Manage
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;