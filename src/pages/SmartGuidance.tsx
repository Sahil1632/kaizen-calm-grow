import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, Clock, Star, Zap } from "lucide-react";

const SmartGuidance = () => {
  const [taskDescription, setTaskDescription] = useState("");
  const [showMilestones, setShowMilestones] = useState(false);
  const navigate = useNavigate();

  // Simulated milestones based on task input
  const generateMilestones = () => [
    {
      id: 1,
      title: "Research and Planning",
      description: "Gather information and outline approach",
      estimatedTime: 15,
      xp: 10,
      energy: "balanced"
    },
    {
      id: 2,
      title: "Core Work Session",
      description: "Focus on the main task",
      estimatedTime: 25,
      xp: 15,
      energy: "focused"
    },
    {
      id: 3,
      title: "Review and Polish",
      description: "Check work and make improvements", 
      estimatedTime: 10,
      xp: 8,
      energy: "balanced"
    },
    {
      id: 4,
      title: "Final Touches",
      description: "Complete and organize results",
      estimatedTime: 5,
      xp: 5,
      energy: "low"
    }
  ];

  const handleAnalyze = () => {
    if (taskDescription.trim()) {
      setShowMilestones(true);
    }
  };

  const startMilestone = (milestone: any) => {
    const taskData = {
      title: milestone.title,
      description: milestone.description,
      estimatedTime: milestone.estimatedTime,
      xp: milestone.xp,
      type: "smart-guidance",
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem("kaizen-current-task", JSON.stringify(taskData));
    navigate("/focus");
  };

  const energyColors: Record<string, string> = {
    low: "energy-low",
    balanced: "energy-balanced", 
    focused: "energy-focused",
    peak: "energy-peak"
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
          <h1 className="text-xl font-bold text-growth">Smart Guidance</h1>
        </div>

        {!showMilestones ? (
          <Card className="p-6 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
            <div className="text-center mb-6">
              <Brain className="w-12 h-12 mx-auto mb-3 text-primary animate-breathe" />
              <h2 className="text-lg font-bold text-growth mb-2">Describe your task</h2>
              <p className="text-zen">We'll break it into manageable milestones</p>
            </div>

            <div className="space-y-6">
              <Input
                placeholder="Write that presentation for next week..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
              />

                <Button
                  onClick={handleAnalyze}
                  disabled={!taskDescription.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-focus hover:shadow-zen transition-all duration-300 rounded-xl h-14 text-lg font-semibold disabled:opacity-50"
                  size="lg"
                >
                  Break It Down ✨
                </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-growth mb-2">Your Milestones</h2>
              <p className="text-zen">Take them one at a time</p>
            </div>

            {generateMilestones().map((milestone, index) => (
              <Card key={milestone.id} className="p-4 shadow-zen bg-card/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-growth mb-1">{milestone.title}</h3>
                    <p className="text-sm text-zen">{milestone.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {index + 1}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{milestone.estimatedTime}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{milestone.xp} XP</span>
                    </div>
                    <Badge 
                      className={`${energyColors[milestone.energy]} text-xs`}
                      variant="secondary"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      {milestone.energy}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={() => startMilestone(milestone)}
                  className="w-full bg-gradient-growth text-primary-foreground"
                  size="sm"
                >
                  Start This Milestone
                </Button>
              </Card>
            ))}

            <Button
              variant="ghost"
              onClick={() => setShowMilestones(false)}
              className="w-full text-muted-foreground"
            >
              Edit Task Description
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartGuidance;