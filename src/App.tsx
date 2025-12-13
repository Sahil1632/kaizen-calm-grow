import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FloatingMenu } from "@/components/FloatingMenu";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import Reflection from "./pages/Reflection";
import NotificationSettings from "./pages/NotificationSettings";

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
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/quick-start" element={<ProtectedRoute><QuickStart /></ProtectedRoute>} />
        <Route path="/smart-guidance" element={<ProtectedRoute><SmartGuidance /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
        <Route path="/reflect" element={<ProtectedRoute><Reflection /></ProtectedRoute>} />
        <Route path="/growth" element={<ProtectedRoute><Growth /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFloatingMenu && <div aria-hidden className="h-14" />}
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
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
