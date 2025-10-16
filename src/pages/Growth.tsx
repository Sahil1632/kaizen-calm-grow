import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock, Target, Trophy, Star, Leaf, Award, Share2 } from "lucide-react";
import kaizenPlant from "@/assets/kaizen-plant.jpg";
import CalendarHeatmap from "@/components/CalendarHeatmap";
import { useToast } from "@/hooks/use-toast";

const ACHIEVEMENT_BADGES = [
  { id: "first-session", emoji: "🌱", name: "First Steps", description: "Complete your first session", requirement: 1, stat: "totalSessions" },
  { id: "five-sessions", emoji: "🌿", name: "Growing Strong", description: "Complete 5 sessions", requirement: 5, stat: "totalSessions" },
  { id: "ten-sessions", emoji: "🌳", name: "Deeply Rooted", description: "Complete 10 sessions", requirement: 10, stat: "totalSessions" },
  { id: "100-minutes", emoji: "⏱️", name: "Time Master", description: "Focus for 100 minutes", requirement: 100, stat: "totalMinutes" },
  { id: "500-minutes", emoji: "⏰", name: "Focus Champion", description: "Focus for 500 minutes", requirement: 500, stat: "totalMinutes" },
  { id: "streak-3", emoji: "🔥", name: "On Fire", description: "3 day streak", requirement: 3, stat: "streakDays" },
  { id: "streak-7", emoji: "💫", name: "Week Warrior", description: "7 day streak", requirement: 7, stat: "streakDays" },
  { id: "100-xp", emoji: "✨", name: "Rising Star", description: "Earn 100 XP", requirement: 100, stat: "totalXP" },
  { id: "500-xp", emoji: "🌟", name: "Shining Bright", description: "Earn 500 XP", requirement: 500, stat: "totalXP" },
];

const Growth = () => {
  const [stats, setStats] = useState<any>({});
  const [recentWins, setRecentWins] = useState<any[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem("kaizen-stats") || "{}");
    const completions = JSON.parse(localStorage.getItem("kaizen-completions") || "[]");
    
    const currentStats = {
      totalSessions: savedStats.totalSessions || 0,
      totalMinutes: savedStats.totalMinutes || 0,
      totalXP: savedStats.totalXP || 0,
      streakDays: savedStats.streakDays || 1
    };
    
    setStats(currentStats);
    setRecentWins(completions.slice(-3).reverse());

    // Calculate earned badges
    const earned = ACHIEVEMENT_BADGES.filter(badge => 
      currentStats[badge.stat] >= badge.requirement
    ).map(badge => badge.id);
    setEarnedBadges(earned);

    // Check if coming from completion
    if (searchParams.get("completed") === "true") {
      setShowCompletion(true);
    }
  }, [searchParams]);

  const shareBadge = (badge: typeof ACHIEVEMENT_BADGES[0]) => {
    const shareText = `🎉 I just earned the "${badge.name}" badge on Kaizen! ${badge.emoji}\n${badge.description}\n#KaizenApp #Achievement`;
    
    if (navigator.share) {
      navigator.share({
        title: `Kaizen Achievement: ${badge.name}`,
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your achievement on social media",
      });
    }
  };

  const handleNewMilestone = () => {
    navigate("/home");
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 text-center shadow-zen bg-card/80 backdrop-blur-sm animate-grow">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-leaf-fall">🍃</div>
            <h1 className="text-2xl font-bold text-growth mb-2">Well done!</h1>
            <p className="text-zen">Your focus session is complete</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-primary">{stats.totalXP}</div>
                <div className="text-zen">Total XP</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-primary">{stats.streakDays}</div>
                <div className="text-zen">Day Streak</div>
              </div>
            </div>

            <Card className="p-4 bg-gradient-zen">
              <h3 className="font-medium text-growth mb-2">What went well?</h3>
              <input 
                placeholder="I stayed focused and..."
                className="w-full bg-transparent border-b border-primary/20 focus:border-primary outline-none text-sm"
              />
            </Card>

            <Card className="p-4 bg-gradient-zen">
              <h3 className="font-medium text-growth mb-2">One thing to try tomorrow</h3>
              <input 
                placeholder="Next time I'll..."
                className="w-full bg-transparent border-b border-primary/20 focus:border-primary outline-none text-sm"
              />
            </Card>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleNewMilestone}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold"
              size="lg"
            >
              Start Another Milestone ✨
            </Button>

            <Button
              onClick={() => navigate("/home")}
              variant="outline"
              className="w-full border-primary text-primary"
            >
              Rest for Now
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-growth">Growth</h1>
        </div>

        {/* Animated Flower */}
        <Card className="p-6 mb-6 text-center shadow-zen bg-gradient-zen animate-fade-in">
          <div className="text-6xl mb-4 animate-flower-bloom">🌸</div>
          <h2 className="text-lg font-bold text-growth mb-2">Your Garden Grows</h2>
          <p className="text-zen">Each session nurtures your progress</p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center shadow-zen bg-card/80 backdrop-blur-sm">
            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="font-bold text-growth">{stats.totalMinutes}</div>
            <div className="text-xs text-zen">Focus Minutes</div>
          </Card>

          <Card className="p-4 text-center shadow-zen bg-card/80 backdrop-blur-sm">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="font-bold text-growth">{stats.totalSessions}</div>
            <div className="text-xs text-zen">Sessions</div>
          </Card>

          <Card className="p-4 text-center shadow-zen bg-card/80 backdrop-blur-sm">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="font-bold text-growth">{stats.streakDays}</div>
            <div className="text-xs text-zen">Day Streak</div>
          </Card>

          <Card className="p-4 text-center shadow-zen bg-card/80 backdrop-blur-sm">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="font-bold text-growth">{stats.totalXP}</div>
            <div className="text-xs text-zen">Total XP</div>
          </Card>
        </div>

        {/* Recent Wins */}
        {recentWins.length > 0 && (
          <Card className="p-4 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <Leaf className="w-4 h-4 mr-2 text-primary" />
              <h3 className="font-medium text-growth">Recent Wins</h3>
            </div>
            
            <div className="space-y-2">
              {recentWins.map((win, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-zen truncate">{win.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {win.xp || 10} XP
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Achievement Badges */}
        <Card className="p-4 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <Award className="w-4 h-4 mr-2 text-primary" />
            <h3 className="font-medium text-growth">Achievement Badges</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENT_BADGES.map((badge) => {
              const isEarned = earnedBadges.includes(badge.id);
              const progress = Math.min((stats[badge.stat] / badge.requirement) * 100, 100);
              
              return (
                <div 
                  key={badge.id}
                  className={`relative p-3 rounded-xl text-center transition-all duration-300 ${
                    isEarned 
                      ? 'bg-gradient-zen shadow-soft cursor-pointer hover:scale-105' 
                      : 'bg-muted/40 opacity-60'
                  }`}
                  onClick={() => isEarned && shareBadge(badge)}
                >
                  <div className={`text-3xl mb-1 ${isEarned ? 'animate-bounce' : 'grayscale'}`}>
                    {badge.emoji}
                  </div>
                  <div className="text-[10px] font-medium text-foreground mb-1 leading-tight">
                    {badge.name}
                  </div>
                  {!isEarned && (
                    <div className="text-[9px] text-zen">
                      {Math.floor(progress)}%
                    </div>
                  )}
                  {isEarned && (
                    <Share2 className="w-3 h-3 mx-auto mt-1 text-primary opacity-60" />
                  )}
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-zen text-center mt-4">
            {earnedBadges.length}/{ACHIEVEMENT_BADGES.length} badges earned • Tap to share
          </p>
        </Card>

        {/* Calendar Heatmap */}
        <div className="mb-6">
          <CalendarHeatmap />
        </div>

        <Button
          onClick={() => navigate("/home")}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold"
          size="lg"
        >
          Continue Growing ✨
        </Button>
      </div>
    </div>
  );
};

export default Growth;