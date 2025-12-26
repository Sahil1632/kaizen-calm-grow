const OnboardingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient - the main background color */}
      <div className="absolute inset-0 bg-gradient-calm" />
      
      {/* Subtle floating shapes - more minimal than SoothingBackground */}
      <div className="absolute top-[5%] right-[10%] w-48 h-48 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
      <div className="absolute bottom-[15%] left-[5%] w-56 h-56 rounded-full bg-accent/12 blur-3xl animate-float-medium" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/8 blur-3xl animate-breathe" />
      
      {/* Tiny accent dots */}
      <div className="absolute top-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-primary/50 animate-particle-1" />
      <div className="absolute top-[70%] right-[20%] w-2 h-2 rounded-full bg-accent/45 animate-particle-2" />
      <div className="absolute top-[35%] right-[35%] w-1.5 h-1.5 rounded-full bg-primary/40 animate-particle-3" />
    </div>
  );
};

export default OnboardingBackground;
