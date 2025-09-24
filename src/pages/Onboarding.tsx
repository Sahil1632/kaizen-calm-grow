import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Life already feels like a race",
    subtitle: "Take a breath",
    description: "You don't need another productivity system that makes you feel guilty. You need a space to simply grow.",
    emoji: "🌱"
  },
  {
    title: "Kaizen is your calm space",
    subtitle: "Grow at your own pace",
    description: "Small, gentle steps forward. No pressure, no judgment. Just consistent growth that feels natural.",
    emoji: "🍃"
  },
  {
    title: "We'll remind you why when things get overwhelming",
    subtitle: "Begin your journey",
    description: "Your purpose becomes your compass when motivation fades. Let's set yours together.",
    emoji: "🧭"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/purpose");
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 text-center shadow-zen bg-card/80 backdrop-blur-sm">
        <div className="mb-8 animate-fade-in" key={currentSlide}>
          <div className="text-6xl mb-6 animate-breathe">{slide.emoji}</div>
          <h1 className="text-2xl font-bold text-growth mb-3">{slide.title}</h1>
          <h2 className="text-lg text-primary mb-4">{slide.subtitle}</h2>
          <p className="text-zen leading-relaxed">{slide.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            className="bg-gradient-growth text-primary-foreground"
          >
            {currentSlide === slides.length - 1 ? "Begin" : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;