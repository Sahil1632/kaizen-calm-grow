import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

const CalendarHeatmap = () => {
  const [weekData, setWeekData] = useState<number[]>([]);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    // Generate sample week data (activity levels 0-4)
    const sampleData = [2, 1, 3, 4, 2, 1, 3]; // Last 7 days
    setWeekData(sampleData);
    setTotalHours(4); // Sample: 4 hours this week
  }, []);

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 0: return "bg-muted/30";
      case 1: return "bg-primary/20";
      case 2: return "bg-primary/40";
      case 3: return "bg-primary/60";
      case 4: return "bg-primary/90";
      default: return "bg-muted/30";
    }
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="p-6 shadow-zen bg-card/80 backdrop-blur-sm">
      <h3 className="font-medium text-growth mb-4">This Week's Activity</h3>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {dayLabels.map((day, index) => (
          <div key={day} className="text-center">
            <div className="text-xs text-zen mb-2">{day}</div>
            <div 
              className={`w-8 h-8 rounded-lg transition-all duration-300 hover:scale-110 ${
                getIntensityColor(weekData[index] || 0)
              }`}
              title={`${day}: ${weekData[index] || 0} sessions`}
            />
          </div>
        ))}
      </div>

      {/* Intensity Legend */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-zen">Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(level)}`}
            />
          ))}
        </div>
        <span className="text-xs text-zen">More</span>
      </div>

      {/* Motivational Message */}
      <div className="text-center p-4 bg-gradient-zen rounded-lg">
        <p className="text-sm text-growth font-medium">
          This week you stayed focused for {totalHours} hours 💪
        </p>
        <p className="text-xs text-zen mt-1">
          That's one step closer to your purpose
        </p>
      </div>
    </Card>
  );
};

export default CalendarHeatmap;