import { Sparkles, Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-8 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      
      <div className="max-w-6xl mx-auto relative">
        <div className="flex items-center justify-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-xl opacity-40 animate-pulse-soft" />
            <div className="relative p-3 rounded-2xl gradient-primary shadow-glow">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              <span className="text-gradient">SmartVal</span>
              <span className="text-foreground ml-2">AI</span>
            </h1>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            <span>AI-Powered</span>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Fair Market Valuation for Your Assets
          </p>
        </div>
      </div>
    </header>
  );
}
