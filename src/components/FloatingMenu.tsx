import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, PenLine, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: TrendingUp, label: "Growth", path: "/growth" },
    { icon: PenLine, label: "Reflect", path: "/reflect" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
      {/* Navigation Bar */}
      <div className="bg-background/30 backdrop-blur-2xl rounded-full px-1.5 py-1.5 shadow-lg border border-white/20 dark:border-white/10 flex items-center justify-around">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full w-12 h-12 p-0 transition-all duration-300 relative",
              isActive(item.path) 
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-focus scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:scale-105"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-all duration-300",
              isActive(item.path) && "drop-shadow-lg"
            )} />
            <span className="sr-only">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};