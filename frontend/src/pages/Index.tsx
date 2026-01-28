import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ValuationForm } from '@/components/ValuationForm';
import { ValuationResult } from '@/components/ValuationResult';
import {
  calculateValuation,
  type ValuationInput,
  type ValuationResult as ValuationResultType,
} from '@/lib/valuation';
import { Sparkles, TrendingUp, Shield, Zap, IndianRupee, BarChart3 } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<ValuationResultType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<ValuationInput | null>(null);

  // --- FIXED: Variable name updated to match your interface ---
  const handleSubmit = (data: ValuationInput, image: string | null, predictedPrice: number) => {
    
    // 1. Local calculation se basic structure lo (Future trends wagera ke liye)
    const baseResult = calculateValuation(data);

    // 2. Sirf 'currentValue' ko AI Price se replace karo
    const aiResult: ValuationResultType = {
      ...baseResult,
      currentValue: predictedPrice, // ✅ Fixed: 'estimatedValue' -> 'currentValue'
    };

    setResult(aiResult);
    setImageUrl(image);
    setFormData(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background decoration */}
      <div className="fixed inset-0 gradient-mesh opacity-40 pointer-events-none" />
      
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12 relative">
        {/* Features - Show only when no result */}
        {!result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 animate-fade-in">
            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="AI-Powered"
              description="Smart algorithms"
              gradient="from-violet-500 to-purple-600"
            />
            <FeatureCard
              icon={<IndianRupee className="h-5 w-5" />}
              title="INR Format"
              description="Indian pricing"
              gradient="from-emerald-500 to-teal-600"
            />
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Projections"
              description="5-year trends"
              gradient="from-blue-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Accurate"
              description="Market rates"
              gradient="from-orange-500 to-red-500"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Form Section */}
          <div>
            <ValuationForm onSubmit={handleSubmit} />
          </div>

          {/* Results Section */}
          <div>
            {result && formData ? (
              <ValuationResult
                result={result}
                imageUrl={imageUrl}
                category={formData.category}
                condition={formData.condition}
                brandTier={formData.brandTier}
              />
            ) : (
              <div className="hidden lg:flex h-full items-center justify-center">
                <div className="text-center p-12 rounded-3xl border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 gradient-primary blur-2xl opacity-20 animate-pulse-soft" />
                    <div className="relative p-5 rounded-2xl bg-accent">
                      <Zap className="h-10 w-10 text-accent-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                    Fill in the form to get an instant fair market valuation of your item
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group p-4 rounded-2xl glass-card shadow-card hover-lift cursor-default">
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default Index;