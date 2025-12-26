const OnboardingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-calm" />
      
      {/* Subtle floating shapes - more minimal than SoothingBackground */}
      <div className="absolute top-[5%] right-[10%] w-48 h-48 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl animate-float-slow opacity-60" />
      <div className="absolute bottom-[15%] left-[5%] w-56 h-56 rounded-full bg-gradient-to-tr from-accent/8 to-transparent blur-3xl animate-float-medium opacity-50" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-3xl animate-breathe opacity-40" />
      
      {/* Tiny accent dots */}
      <div className="absolute top-[20%] left-[25%] w-1 h-1 rounded-full bg-primary/40 animate-particle-1" />
      <div className="absolute top-[70%] right-[20%] w-1.5 h-1.5 rounded-full bg-accent/35 animate-particle-2" />
      <div className="absolute top-[35%] right-[35%] w-1 h-1 rounded-full bg-primary/30 animate-particle-3" />
    </div>
  );
};

export default OnboardingBackground;
