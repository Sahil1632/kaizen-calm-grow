import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface PlantGrowthProps {
  totalSessions: number;
  totalMinutes: number;
  totalXP: number;
}

const PlantGrowth = ({ totalSessions, totalMinutes, totalXP }: PlantGrowthProps) => {
  const [growthStage, setGrowthStage] = useState(0);

  useEffect(() => {
    // Calculate growth stage based on stats (0-5)
    const sessionScore = Math.min(totalSessions / 20, 1);
    const minuteScore = Math.min(totalMinutes / 200, 1);
    const xpScore = Math.min(totalXP / 500, 1);
    const avgScore = (sessionScore + minuteScore + xpScore) / 3;
    const stage = Math.floor(avgScore * 5);
    setGrowthStage(stage);
  }, [totalSessions, totalMinutes, totalXP]);

  const getPlantVisual = () => {
    switch(growthStage) {
      case 0:
        return {
          title: "Seedling",
          message: "Your journey begins! 🌱",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-32 h-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full blur-sm"></div>
              <div className="relative">
                <div className="w-3 h-8 bg-gradient-to-t from-green-600 to-green-400 rounded-t-full animate-grow"></div>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-300 rounded-full opacity-80"></div>
              </div>
            </div>
          )
        };
      case 1:
        return {
          title: "Young Sprout",
          message: "Growing strong! 🌿",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-32 h-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full blur-sm"></div>
              <div className="relative">
                <div className="w-4 h-16 bg-gradient-to-t from-green-700 to-green-500 rounded-t-lg"></div>
                <div className="absolute top-4 -left-3 w-6 h-3 bg-gradient-to-br from-green-500 to-green-400 rounded-full rotate-[-30deg] animate-leaf-fall"></div>
                <div className="absolute top-8 -right-3 w-6 h-3 bg-gradient-to-bl from-green-500 to-green-400 rounded-full rotate-[30deg] animate-leaf-fall" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )
        };
      case 2:
        return {
          title: "Growing Plant",
          message: "Building momentum! 🌿",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-32 h-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full blur-sm"></div>
              <div className="relative">
                <div className="w-5 h-20 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-lg"></div>
                {[-4, -2, 2, 4].map((offset, i) => (
                  <div
                    key={i}
                    className="absolute w-8 h-4 bg-gradient-to-br from-green-500 to-green-400 rounded-full animate-breathe"
                    style={{
                      top: `${10 + i * 5}px`,
                      [offset < 0 ? 'left' : 'right']: `${Math.abs(offset)}px`,
                      transform: `rotate(${offset * 10}deg)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )
        };
      case 3:
        return {
          title: "Budding Plant",
          message: "Almost blooming! 🌸",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-32 h-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full blur-sm"></div>
              <div className="relative">
                <div className="w-5 h-24 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-lg"></div>
                {[-5, -3, 3, 5].map((offset, i) => (
                  <div
                    key={i}
                    className="absolute w-10 h-5 bg-gradient-to-br from-green-500 to-green-400 rounded-full animate-breathe"
                    style={{
                      top: `${8 + i * 4}px`,
                      [offset < 0 ? 'left' : 'right']: `${Math.abs(offset)}px`,
                      transform: `rotate(${offset * 8}deg)`,
                      animationDelay: `${i * 0.15}s`
                    }}
                  ></div>
                ))}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-300 rounded-full opacity-90 animate-flower-bloom"></div>
              </div>
            </div>
          )
        };
      case 4:
        return {
          title: "Blooming Flower",
          message: "In full bloom! 🌺",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-32 h-2 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full blur-sm"></div>
              <div className="relative">
                <div className="w-5 h-24 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-lg"></div>
                {[-6, -4, 4, 6].map((offset, i) => (
                  <div
                    key={i}
                    className="absolute w-12 h-6 bg-gradient-to-br from-green-500 to-green-400 rounded-full animate-breathe"
                    style={{
                      top: `${6 + i * 5}px`,
                      [offset < 0 ? 'left' : 'right']: `${Math.abs(offset)}px`,
                      transform: `rotate(${offset * 7}deg)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="relative w-14 h-14">
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-6 h-8 bg-gradient-to-br from-pink-400 via-pink-300 to-pink-200 rounded-full animate-flower-bloom"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-12px)`,
                          transformOrigin: 'center',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      default:
        return {
          title: "Flourishing Garden",
          message: "Mastery achieved! 🌸🌺🌼",
          plant: (
            <div className="relative h-32 flex items-end justify-center">
              <div className="absolute bottom-0 w-40 h-3 bg-gradient-to-r from-amber-900/40 via-amber-800/40 to-amber-900/40 rounded-full blur-sm"></div>
              <div className="relative flex gap-2">
                {[0, 1, 2].map((plantIndex) => (
                  <div key={plantIndex} className="relative">
                    <div className="w-4 h-20 bg-gradient-to-t from-green-800 via-green-600 to-green-500 rounded-t-lg"></div>
                    {[-4, 4].map((offset, i) => (
                      <div
                        key={i}
                        className="absolute w-10 h-5 bg-gradient-to-br from-green-500 to-green-400 rounded-full animate-breathe"
                        style={{
                          top: `${8 + i * 6}px`,
                          [offset < 0 ? 'left' : 'right']: `${Math.abs(offset)}px`,
                          transform: `rotate(${offset * 8}deg)`,
                          animationDelay: `${(plantIndex * 0.3) + (i * 0.15)}s`
                        }}
                      ></div>
                    ))}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="relative w-10 h-10">
                        {[0, 90, 180, 270].map((angle, i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-4 h-6 rounded-full animate-flower-bloom"
                            style={{
                              background: plantIndex === 0 ? 'linear-gradient(to bottom right, hsl(340, 75%, 65%), hsl(340, 70%, 75%))' : 
                                         plantIndex === 1 ? 'linear-gradient(to bottom right, hsl(280, 70%, 65%), hsl(280, 65%, 75%))' :
                                         'linear-gradient(to bottom right, hsl(200, 70%, 65%), hsl(200, 65%, 75%))',
                              transform: `rotate(${angle}deg) translateY(-8px)`,
                              transformOrigin: 'center',
                              animationDelay: `${(plantIndex * 0.2) + (i * 0.1)}s`
                            }}
                          ></div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        };
    }
  };

  const plantVisual = getPlantVisual();

  return (
    <Card className="p-6 mb-6 text-center shadow-zen bg-gradient-zen animate-fade-in overflow-hidden">
      <div className="mb-4">
        {plantVisual.plant}
      </div>
      <h2 className="text-lg font-bold text-growth mb-2">{plantVisual.title}</h2>
      <p className="text-zen">{plantVisual.message}</p>
      <div className="mt-4 flex justify-center gap-1">
        {[0, 1, 2, 3, 4, 5].map((stage) => (
          <div
            key={stage}
            className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
              stage <= growthStage 
                ? 'bg-primary shadow-focus' 
                : 'bg-muted'
            }`}
          ></div>
        ))}
      </div>
    </Card>
  );
};

export default PlantGrowth;