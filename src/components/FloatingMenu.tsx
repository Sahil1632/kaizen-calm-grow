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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Navigation Bar */}
      <div className="bg-card/90 backdrop-blur-md rounded-full px-4 py-3 shadow-zen border border-primary/20 flex items-center space-x-6">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full w-12 h-12 p-0 transition-all duration-300",
              isActive(item.path) 
                ? "bg-primary text-primary-foreground shadow-soft" 
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="sr-only">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};