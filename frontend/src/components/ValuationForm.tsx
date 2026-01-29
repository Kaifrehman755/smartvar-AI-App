import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Calculator, Sparkles, ImageIcon, X, Loader2 } from 'lucide-react';
import type { Category, Condition, BrandTier, ValuationInput } from '@/lib/valuation';

// --- 1. Mapping Dictionaries (Frontend Text -> Backend Numbers) ---
const conditionMap: Record<string, number> = {
  excellent: 5,
  good: 4,
  fair: 3,
  poor: 1
};

const brandMap: Record<string, number> = {
  premium: 3,
  'mid-range': 2,
  budget: 1
};

interface ValuationFormProps {
  // Update: Ab hum 'predictedPrice' bhi wapas bhejenge
  onSubmit: (data: ValuationInput, imageUrl: string | null, predictedPrice: number) => void;
}

export function ValuationForm({ onSubmit }: ValuationFormProps) {
  const [originalPrice, setOriginalPrice] = useState('');
  const [purchaseYear, setPurchaseYear] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [condition, setCondition] = useState<Condition | ''>('');
  const [brandTier, setBrandTier] = useState<BrandTier | ''>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Loading state add kiya hai API wait ke liye
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- 2. Main Submit Logic (Updated for API) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originalPrice || !purchaseYear || !category || !condition || !brandTier) {
      return;
    }

    setIsLoading(true); // Loading Start

    try {
      // Data prepare karo Backend format mein
      const age = currentYear - parseInt(purchaseYear);
      const apiPayload = {
        original_price: parseFloat(originalPrice),
        age: age < 0 ? 0 : age, // Negative age fix
        condition: conditionMap[condition],
        brand_tier: brandMap[brandTier]
      };

      // API Call (Python Server se baat karo)
      const response = await fetch("https://smartvar-ai-backend.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      console.log("AI Price from Backend:", result.estimated_price);

      // Parent component ko Data + AI Price bhejo
      onSubmit(
        {
          originalPrice: parseFloat(originalPrice),
          purchaseYear: parseInt(purchaseYear),
          category: category as Category,
          condition: condition as Condition,
          brandTier: brandTier as BrandTier,
        },
        imagePreview,
        result.estimated_price // Yeh naya 3rd argument hai!
      );

    } catch (error) {
      console.error("Failed to fetch valuation:", error);
      alert("Backend Server Error! Make sure 'uvicorn main:app' is running.");
    } finally {
      setIsLoading(false); // Loading Stop
    }
  };

  const isFormValid = originalPrice && purchaseYear && category && condition && brandTier;

  return (
    <Card className="glass-card shadow-card border-0 animate-slide-up hover-lift">
      <CardHeader className="space-y-2 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-lg opacity-30" />
            <div className="relative p-2.5 rounded-xl gradient-primary">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-xl font-display font-bold">Item Details</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Enter information for accurate valuation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              Item Photo
              <span className="text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <div
              onClick={() => !imagePreview && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                imagePreview 
                  ? 'border-success/50 bg-success-light/30' 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer'
              } group`}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-xl object-cover shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 p-8 text-muted-foreground group-hover:text-primary transition-colors">
                  <div className="p-3 rounded-full bg-muted group-hover:bg-accent transition-colors">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-semibold block">Click to upload</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="category" className="h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="electronics" className="rounded-lg">📱 Electronics</SelectItem>
                <SelectItem value="vehicles" className="rounded-lg">🚗 Vehicles</SelectItem>
                <SelectItem value="furniture" className="rounded-lg">🪑 Furniture</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Original Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold">
              Original Purchase Price
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                ₹
              </span>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 50000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20 text-lg font-medium"
                min="0"
              />
            </div>
          </div>

          {/* Purchase Year */}
          <div className="space-y-2">
            <Label htmlFor="year" className="text-sm font-semibold">
              Purchase Year
            </Label>
            <Select value={purchaseYear} onValueChange={setPurchaseYear}>
              <SelectTrigger id="year" className="h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-64">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="rounded-lg">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-sm font-semibold">
              Current Condition
            </Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
              <SelectTrigger id="condition" className="h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="excellent" className="rounded-lg">✨ Excellent (Like New)</SelectItem>
                <SelectItem value="good" className="rounded-lg">👍 Good (Minor Wear)</SelectItem>
                <SelectItem value="fair" className="rounded-lg">👌 Fair (Visible Wear)</SelectItem>
                <SelectItem value="poor" className="rounded-lg">⚠️ Poor (Heavy Wear)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand Tier */}
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-sm font-semibold">
              Brand Tier
            </Label>
            <Select value={brandTier} onValueChange={(v) => setBrandTier(v as BrandTier)}>
              <SelectTrigger id="brand" className="h-12 rounded-xl bg-background/50 border-border/50 focus:ring-primary/20">
                <SelectValue placeholder="Select brand tier" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="premium" className="rounded-lg">👑 Premium Brand</SelectItem>
                <SelectItem value="mid-range" className="rounded-lg">⭐ Mid-Range Brand</SelectItem>
                <SelectItem value="budget" className="rounded-lg">💰 Budget Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-14 text-base font-bold rounded-xl gradient-primary hover:opacity-90 transition-all duration-300 disabled:opacity-40 shadow-glow disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Calculate Fair Value
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}