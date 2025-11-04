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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      {/* Navigation Bar */}
      <div className="bg-card/95 backdrop-blur-xl rounded-full px-2 py-2 shadow-floating border border-primary/30 flex items-center justify-around">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-full w-14 h-14 p-0 transition-all duration-300 relative",
              isActive(item.path) 
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-focus scale-110" 
                : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:scale-105"
            )}
          >
            <item.icon className={cn(
              "w-6 h-6 transition-all duration-300",
              isActive(item.path) && "drop-shadow-lg"
            )} />
            <span className="sr-only">{item.label}</span>
            {isActive(item.path) && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary-foreground rounded-full" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};