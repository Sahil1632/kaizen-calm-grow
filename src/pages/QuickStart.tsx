import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Target } from "lucide-react";

const QuickStart = () => {
  const [task, setTask] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("25");
  const [isFocus, setIsFocus] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (task.trim()) {
      const taskData = {
        title: task,
        estimatedTime: parseInt(estimatedTime),
        type: "quick-start",
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem("kaizen-current-task", JSON.stringify(taskData));
      
      if (isFocus) {
        navigate("/focus");
      } else {
        // Save for later and return to home
        navigate("/home");
      }
    }
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
          <h1 className="text-xl font-bold text-growth">Quick Start</h1>
        </div>

        <Card className="p-6 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center mb-6">
            <Target className="w-12 h-12 mx-auto mb-3 text-primary animate-breathe" />
            <h2 className="text-lg font-bold text-growth mb-2">What's on your mind?</h2>
            <p className="text-zen">Add a task to focus on today</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="task" className="text-growth">Your task</Label>
              <Input
                id="task"
                placeholder="Write that important email..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-growth flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Estimated time (minutes)</span>
              </Label>
              <Input
                id="time"
                type="number"
                min="5"
                max="120"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="mt-2 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsFocus(true);
                  handleSubmit();
                }}
                disabled={!task.trim()}
                className="w-full bg-gradient-growth text-primary-foreground shadow-soft hover:shadow-focus transition-all duration-300"
                size="lg"
              >
                Start Focus Session
              </Button>

              <Button
                onClick={() => {
                  setIsFocus(false);
                  handleSubmit();
                }}
                disabled={!task.trim()}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
                size="lg"
              >
                Save for Later
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuickStart;