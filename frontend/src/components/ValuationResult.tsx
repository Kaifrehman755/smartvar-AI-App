import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Calendar, Tag, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatIndianRupee, type ValuationResult as ValuationResultType } from '@/lib/valuation';
import { PriceTrendChart } from './PriceTrendChart';

interface ValuationResultProps {
  result: ValuationResultType;
  imageUrl: string | null;
  category: string;
  condition: string;
  brandTier: string;
}

export function ValuationResult({
  result,
  imageUrl,
  category,
  condition,
  brandTier,
}: ValuationResultProps) {
  const depreciationPercent = Math.round((1 - result.currentValue / result.originalPrice) * 100);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Main Result Card */}
      <Card className="glass-card shadow-card border-0 overflow-hidden hover-lift">
        {/* Success Header */}
        <div className="relative gradient-success p-8 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-success-foreground text-sm font-medium mb-4">
              <CheckCircle2 className="h-4 w-4" />
              Valuation Complete
            </div>
            <p className="text-success-foreground/80 text-sm font-medium mb-2">
              Estimated Fair Market Value
            </p>
            <p className="text-5xl md:text-6xl font-display font-bold text-success-foreground tracking-tight">
              {formatIndianRupee(result.currentValue)}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-success-foreground/90 text-sm font-medium">
              <TrendingDown className="h-4 w-4" />
              <span>{depreciationPercent}% depreciated from original</span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary blur-xl opacity-20" />
                <img
                  src={imageUrl}
                  alt="Item"
                  className="relative max-h-48 rounded-2xl object-cover shadow-xl border-4 border-white"
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailItem
              icon={<Tag className="h-4 w-4" />}
              label="Original Price"
              value={formatIndianRupee(result.originalPrice)}
            />
            <DetailItem
              icon={<Calendar className="h-4 w-4" />}
              label="Age"
              value={`${result.age} year${result.age !== 1 ? 's' : ''}`}
            />
            <DetailItem
              icon={<TrendingDown className="h-4 w-4" />}
              label="Depreciation"
              value={`${Math.round(result.depreciationRate * 100)}% / year`}
            />
            <DetailItem
              icon={<Award className="h-4 w-4" />}
              label="Multipliers"
              value={`${result.conditionMultiplier}x × ${result.brandTierMultiplier}x`}
            />
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="rounded-full px-3 py-1 bg-accent text-accent-foreground capitalize font-medium">
              {category}
            </Badge>
            <Badge className="rounded-full px-3 py-1 bg-accent text-accent-foreground capitalize font-medium">
              {condition}
            </Badge>
            <Badge className="rounded-full px-3 py-1 bg-accent text-accent-foreground capitalize font-medium">
              {brandTier.replace('-', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Price Trend Chart */}
      <Card className="glass-card shadow-card border-0 hover-lift">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-display font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              <TrendingDown className="h-5 w-5 text-accent-foreground" />
            </div>
            5-Year Price Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PriceTrendChart data={result.futurePrices} />
          
          {/* Future Prices List */}
          <div className="mt-6 space-y-2">
            {result.futurePrices.slice(1).map((item) => (
              <div
                key={item.year}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-semibold">{item.year}</span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatIndianRupee(item.price)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-200">
      <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
}
