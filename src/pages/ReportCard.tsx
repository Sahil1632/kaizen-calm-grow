import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Trophy, Clock, Target, Zap, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfWeek, startOfMonth, isWithinInterval } from "date-fns";

type ReportPeriod = "weekly" | "monthly";

interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
  abandonedTasks: number;
  totalTimeSpent: number;
  estimatedTime: number;
  xpEarned: number;
  xpLost: number;
  interruptedSessions: number;
}

const ReportCard = () => {
  const [period, setPeriod] = useState<ReportPeriod>(
    () => (localStorage.getItem("kaizen-report-period") as ReportPeriod) || "weekly"
  );
  const [metrics, setMetrics] = useState<TaskMetrics>({
    totalTasks: 0,
    completedTasks: 0,
    abandonedTasks: 0,
    totalTimeSpent: 0,
    estimatedTime: 0,
    xpEarned: 0,
    xpLost: 0,
    interruptedSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("kaizen-report-period", period);
    fetchMetrics();
  }, [period]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const now = new Date();
      const startDate = period === "weekly" 
        ? startOfWeek(now, { weekStartsOn: 1 }) 
        : startOfMonth(now);

      const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", startDate.toISOString());

      if (tasks) {
        const completed = tasks.filter(t => t.status === "completed");
        const abandoned = tasks.filter(t => t.status === "pending" && t.due_at && new Date(t.due_at) < now);
        const inProgress = tasks.filter(t => t.status === "in_progress");
        
        // Calculate metrics from localStorage session data
        const savedStats = JSON.parse(localStorage.getItem("kaizen-stats") || "{}");
        const completions = JSON.parse(localStorage.getItem("kaizen-completions") || "[]");
        const interruptions = JSON.parse(localStorage.getItem("kaizen-interruptions") || "0");
        
        // Filter completions by period
        const periodCompletions = completions.filter((c: any) => {
          if (!c.completedAt) return false;
          const completedDate = new Date(c.completedAt);
          return isWithinInterval(completedDate, { start: startDate, end: now });
        });

        const totalTimeSpent = periodCompletions.reduce((acc: number, c: any) => acc + (c.duration || 0), 0);
        const xpEarned = periodCompletions.reduce((acc: number, c: any) => acc + (c.xp || 0), 0);
        const xpLost = abandoned.reduce((acc, t) => acc + (t.xp || 0), 0) + (inProgress.length * 5);

        setMetrics({
          totalTasks: tasks.length,
          completedTasks: completed.length,
          abandonedTasks: abandoned.length,
          totalTimeSpent,
          estimatedTime: tasks.reduce((acc, t) => acc + (t.estimated_time || 0), 0),
          xpEarned,
          xpLost,
          interruptedSessions: parseInt(localStorage.getItem("kaizen-interruptions") || "0"),
        });
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
    setLoading(false);
  };

  const completionRate = metrics.totalTasks > 0 
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) 
    : 0;

  const abandonmentRate = metrics.totalTasks > 0 
    ? Math.round((metrics.abandonedTasks / metrics.totalTasks) * 100) 
    : 0;

  const efficiencyRate = metrics.estimatedTime > 0 
    ? Math.min(Math.round((metrics.totalTimeSpent / metrics.estimatedTime) * 100), 100) 
    : 0;

  const getInsights = () => {
    const insights: { type: "positive" | "improvement" | "warning"; message: string }[] = [];

    if (completionRate >= 80) {
      insights.push({ type: "positive", message: "Amazing! You're completing most of your tasks. Keep this momentum going!" });
    } else if (completionRate >= 50) {
      insights.push({ type: "improvement", message: "Good progress! Try breaking larger tasks into smaller milestones." });
    } else if (completionRate > 0) {
      insights.push({ type: "warning", message: "Consider starting with your highest-energy tasks first." });
    }

    if (metrics.interruptedSessions > 3) {
      insights.push({ type: "warning", message: `You stopped ${metrics.interruptedSessions} sessions early. Try shorter focus blocks.` });
    }

    if (metrics.xpLost > metrics.xpEarned * 0.3) {
      insights.push({ type: "improvement", message: "You're leaving XP on the table. Completing nudged tasks adds up!" });
    }

    if (abandonmentRate > 30) {
      insights.push({ type: "warning", message: "Many tasks went unfinished. Try setting more realistic due dates." });
    }

    return insights.length > 0 ? insights : [{ type: "positive" as const, message: "Start completing tasks to see personalized insights!" }];
  };

  const CircularProgress = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: any; color: string }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/30"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        <span className="text-xs text-zen mt-2">{label}</span>
      </div>
    );
  };

  const TrendIndicator = ({ isPositive }: { isPositive: boolean }) => (
    <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-primary" : "text-destructive"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      <span>{isPositive ? "Improving" : "Needs focus"}</span>
    </div>
  );

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
          <h1 className="text-xl font-bold text-growth">Your Report Card</h1>
        </div>

        {/* Period Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={period === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("weekly")}
            className="flex-1 rounded-xl"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Weekly
          </Button>
          <Button
            variant={period === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("monthly")}
            className="flex-1 rounded-xl"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Monthly
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-breathe text-4xl">🌱</div>
          </div>
        ) : (
          <>
            {/* Visual Metrics Rings */}
            <Card className="p-6 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
              <h2 className="text-sm font-medium text-zen mb-4 text-center">Your Progress</h2>
              <div className="flex justify-around">
                <CircularProgress 
                  value={completionRate} 
                  label="Completion" 
                  icon={Target}
                  color="hsl(165, 60%, 50%)"
                />
                <CircularProgress 
                  value={100 - abandonmentRate} 
                  label="Focus" 
                  icon={Zap}
                  color="hsl(200, 50%, 70%)"
                />
                <CircularProgress 
                  value={efficiencyRate} 
                  label="Efficiency" 
                  icon={Clock}
                  color="hsl(340, 75%, 65%)"
                />
              </div>
            </Card>

            {/* Journey Summary */}
            <Card className="p-6 mb-6 shadow-zen bg-gradient-zen">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {completionRate >= 70 ? "🌸" : completionRate >= 40 ? "🌿" : "🌱"}
                </div>
                <h2 className="text-lg font-bold text-growth">
                  {completionRate >= 70 ? "Flourishing!" : completionRate >= 40 ? "Growing Strong" : "Just Starting"}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{metrics.completedTasks}</div>
                  <div className="text-xs text-zen">Tasks Done</div>
                  <TrendIndicator isPositive={completionRate >= 50} />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{Math.round(metrics.totalTimeSpent / 60)}h</div>
                  <div className="text-xs text-zen">Focused Time</div>
                  <TrendIndicator isPositive={metrics.totalTimeSpent > 120} />
                </div>
              </div>
            </Card>

            {/* XP Balance */}
            <Card className="p-4 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-medium text-growth">XP Balance</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-primary">+{metrics.xpEarned}</div>
                  <div className="text-xs text-zen">Earned</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center flex-1">
                  <div className="text-xl font-bold text-destructive">-{metrics.xpLost}</div>
                  <div className="text-xs text-zen">Missed</div>
                </div>
              </div>
              
              {metrics.xpLost > 0 && (
                <p className="text-xs text-zen text-center mt-3 italic">
                  Complete nudged tasks to reclaim your lost XP!
                </p>
              )}
            </Card>

            {/* Interruptions */}
            {metrics.interruptedSessions > 0 && (
              <Card className="p-4 mb-6 shadow-zen bg-card/80 backdrop-blur-sm border-l-4 border-accent">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🛑</div>
                  <div>
                    <div className="font-medium text-foreground">
                      {metrics.interruptedSessions} session{metrics.interruptedSessions > 1 ? "s" : ""} stopped early
                    </div>
                    <p className="text-xs text-zen">
                      Try the 2-minute rule: if you feel like stopping, just do 2 more minutes.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Personalized Insights */}
            <Card className="p-4 mb-6 shadow-zen bg-card/80 backdrop-blur-sm">
              <h3 className="font-medium text-growth mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Personalized Insights
              </h3>
              <div className="space-y-3">
                {getInsights().map((insight, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-3 p-3 rounded-xl ${
                      insight.type === "positive" 
                        ? "bg-primary/10" 
                        : insight.type === "improvement" 
                        ? "bg-accent/10" 
                        : "bg-destructive/10"
                    }`}
                  >
                    <span className="text-lg mt-0.5">
                      {insight.type === "positive" ? "✨" : insight.type === "improvement" ? "🌿" : "🔔"}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{insight.message}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Button */}
            <Button
              onClick={() => navigate("/home")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold"
              size="lg"
            >
              Keep Growing 🌱
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
