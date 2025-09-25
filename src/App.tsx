import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FloatingMenu } from "@/components/FloatingMenu";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Purpose from "./pages/Purpose";
import EnergySelection from "./pages/EnergySelection";
import Home from "./pages/Home";
import QuickStart from "./pages/QuickStart";
import SmartGuidance from "./pages/SmartGuidance";
import FocusMode from "./pages/FocusMode";
import Growth from "./pages/Growth";
import Profile from "./pages/Profile";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const AppContent = () => {
  const location = useLocation();
  const showFloatingMenu = !["/", "/onboarding", "/purpose", "/energy"].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/purpose" element={<Purpose />} />
        <Route path="/energy" element={<EnergySelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quick-start" element={<QuickStart />} />
        <Route path="/smart-guidance" element={<SmartGuidance />} />
        <Route path="/focus" element={<FocusMode />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFloatingMenu && <FloatingMenu />}
    </>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
