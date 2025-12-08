const SoothingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-calm" />
      
      {/* Floating orbs - soft, organic shapes */}
      <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute top-[40%] right-[10%] w-80 h-80 rounded-full bg-gradient-to-bl from-accent/15 to-transparent blur-3xl animate-float-medium" />
      <div className="absolute bottom-[20%] left-[20%] w-72 h-72 rounded-full bg-gradient-to-tr from-primary/15 to-accent/10 blur-3xl animate-float-reverse" />
      <div className="absolute top-[60%] right-[30%] w-48 h-48 rounded-full bg-gradient-to-r from-primary/10 to-transparent blur-2xl animate-float-slow" />
      
      {/* Subtle moving waves */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-30">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent animate-wave-slow" />
      </div>
      
      {/* Gentle particles */}
      <div className="absolute top-[25%] left-[40%] w-2 h-2 rounded-full bg-primary/30 animate-particle-1" />
      <div className="absolute top-[45%] left-[70%] w-1.5 h-1.5 rounded-full bg-accent/40 animate-particle-2" />
      <div className="absolute top-[65%] left-[25%] w-2.5 h-2.5 rounded-full bg-primary/25 animate-particle-3" />
      <div className="absolute top-[15%] left-[80%] w-1.5 h-1.5 rounded-full bg-primary/35 animate-particle-4" />
      <div className="absolute top-[75%] left-[55%] w-2 h-2 rounded-full bg-accent/30 animate-particle-5" />
      
      {/* Soft vignette for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />
    </div>
  );
};

export default SoothingBackground;