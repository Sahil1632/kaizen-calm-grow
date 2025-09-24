import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Timer, User, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: TrendingUp, label: "Growth", path: "/growth" },
    { icon: Timer, label: "Timer", path: "/focus" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      <div 
        className={cn(
          "flex flex-col-reverse space-y-3 space-y-reverse mb-3 transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {menuItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            size="lg"
            variant={isActive(item.path) ? "default" : "secondary"}
            className={cn(
              "w-14 h-14 rounded-full shadow-floating backdrop-blur-md transition-all duration-200 hover:scale-105",
              isActive(item.path) 
                ? "bg-primary text-primary-foreground shadow-focus" 
                : "bg-gradient-floating border border-border/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="sr-only">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={cn(
          "w-16 h-16 rounded-full shadow-floating backdrop-blur-md transition-all duration-300 hover:scale-105",
          "bg-gradient-floating border border-border/50 text-foreground",
          isOpen && "rotate-45"
        )}
      >
        {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};