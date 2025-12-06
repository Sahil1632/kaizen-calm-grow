import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Pause, Play, RotateCcw, X, Volume2, Star, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FocusMode = () => {
  const [task, setTask] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedTask = localStorage.getItem("kaizen-current-task");
    if (savedTask) {
      const taskData = JSON.parse(savedTask);
      setTask(taskData);
      setTimeLeft(taskData.estimatedTime * 60); // Convert to seconds
      const auto = localStorage.getItem("kaizen-autostart-focus");
      if (auto) {
        setIsRunning(true);
        localStorage.removeItem("kaizen-autostart-focus");
      }
    } else {
      // No task, redirect to home
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Session complete
      completeSession();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = task?.estimatedTime * 60 || 1500;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(totalTime);
    setIsRunning(false);
  };

  const completeSession = async () => {
    try {
      // Update task status in database if task has an ID
      if (task.id) {
        const { error } = await supabase
          .from("tasks")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", task.id);

        if (error) {
          console.error("Error updating task:", error);
          toast({
            title: "Warning",
            description: "Task completed locally, but failed to sync to database",
            variant: "destructive",
          });
        }
      }

      // Save completion to localStorage for backward compatibility
      const completions = JSON.parse(localStorage.getItem("kaizen-completions") || "[]");
      completions.push({
        ...task,
        completedAt: new Date().toISOString(),
        actualTime: totalTime,
        duration: task?.estimatedTime || 25,
        xp: task?.xp || 10
      });
      localStorage.setItem("kaizen-completions", JSON.stringify(completions));
      
      // Update stats
      const stats = JSON.parse(localStorage.getItem("kaizen-stats") || "{}");
      stats.totalSessions = (stats.totalSessions || 0) + 1;
      stats.totalMinutes = (stats.totalMinutes || 0) + (task?.estimatedTime || 25);
      stats.totalXP = (stats.totalXP || 0) + (task?.xp || 10);
      localStorage.setItem("kaizen-stats", JSON.stringify(stats));

      // Clear current task
      localStorage.removeItem("kaizen-current-task");
      
      // Navigate to completion
      navigate("/growth?completed=true");
    } catch (error: any) {
      console.error("Error completing session:", error);
      toast({
        title: "Error",
        description: "Failed to complete session",
        variant: "destructive",
      });
    }
  };

  const handleExit = () => {
    if (isRunning) {
      setShowExitConfirm(true);
    } else {
      navigate("/home");
    }
  };

  const confirmExit = () => {
    // Track interrupted session for report card
    const interruptions = parseInt(localStorage.getItem("kaizen-interruptions") || "0");
    localStorage.setItem("kaizen-interruptions", String(interruptions + 1));
    
    localStorage.removeItem("kaizen-current-task");
    navigate("/home");
  };

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center shadow-zen bg-card/80 backdrop-blur-sm">
        {!showExitConfirm ? (
          <>
            <div className="mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="absolute top-4 right-4 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <h1 className="text-lg font-bold text-growth mb-2">{task.title}</h1>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" /> {(task?.xp ?? Math.max(8, Math.round((task?.estimatedTime || 25) * 0.6)))} XP
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-secondary/10 text-foreground px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> {task?.estimatedTime || 25}m
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-zen">{task.description}</p>
              )}
            </div>

            <div className="mb-8">
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full border-8 border-primary/20 flex items-center justify-center bg-gradient-zen animate-breathe">
                  <div className="text-4xl font-bold text-growth">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full">
                  <svg className="w-48 h-48 mx-auto -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-primary"
                      strokeDasharray={`${progress * 2.89} 289`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <Progress value={progress} className="mb-4" />
              
              <p className="text-sm text-zen">
                Stay with your session — leaving early resets your streak
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTimer}
                className="border-primary text-primary"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button
                onClick={toggleTimer}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold"
                size="lg"
              >
                {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold text-growth mb-2">Leave session?</h2>
              <p className="text-zen">This will reset your current streak</p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 border-primary text-primary"
              >
                Stay
              </Button>
              <Button
                onClick={confirmExit}
                variant="destructive"
                className="flex-1"
              >
                Leave
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FocusMode;