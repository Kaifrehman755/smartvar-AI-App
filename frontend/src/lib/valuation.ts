// SmartVal AI - Valuation Logic
// Using Indian market depreciation rates

export type Category = 'electronics' | 'vehicles' | 'furniture';
export type Condition = 'excellent' | 'good' | 'fair' | 'poor';
export type BrandTier = 'premium' | 'mid-range' | 'budget';

// Indian market depreciation rates (annual)
export const DEPRECIATION_RATES: Record<Category, number> = {
  electronics: 0.25, // 25% per year
  vehicles: 0.15,    // 15% per year
  furniture: 0.12,   // 12% per year
};

// Condition multipliers
export const CONDITION_MULTIPLIERS: Record<Condition, number> = {
  excellent: 1.0,
  good: 0.85,
  fair: 0.70,
  poor: 0.50,
};

// Brand tier multipliers
export const BRAND_TIER_MULTIPLIERS: Record<BrandTier, number> = {
  premium: 1.15,
  'mid-range': 1.0,
  budget: 0.85,
};

export interface ValuationInput {
  originalPrice: number;
  purchaseYear: number;
  category: Category;
  condition: Condition;
  brandTier: BrandTier;
}

export interface ValuationResult {
  currentValue: number;
  originalPrice: number;
  depreciationRate: number;
  age: number;
  conditionMultiplier: number;
  brandTierMultiplier: number;
  futurePrices: { year: number; price: number }[];
}

/**
 * Calculate valuation using the depreciation formula:
 * Price = Original × (1 - Rate)^Age × Condition × BrandTier
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  const currentYear = new Date().getFullYear();
  const age = currentYear - input.purchaseYear;
  
  const depreciationRate = DEPRECIATION_RATES[input.category];
  const conditionMultiplier = CONDITION_MULTIPLIERS[input.condition];
  const brandTierMultiplier = BRAND_TIER_MULTIPLIERS[input.brandTier];
  
  // Apply the formula: Price = Original × (1 - Rate)^Age × Condition × BrandTier
  const depreciatedValue = input.originalPrice * Math.pow(1 - depreciationRate, age);
  const currentValue = depreciatedValue * conditionMultiplier * brandTierMultiplier;
  
  // Calculate future prices for the next 5 years
  const futurePrices: { year: number; price: number }[] = [];
  for (let i = 0; i <= 5; i++) {
    const futureAge = age + i;
    const futureDepreciatedValue = input.originalPrice * Math.pow(1 - depreciationRate, futureAge);
    const futurePrice = futureDepreciatedValue * conditionMultiplier * brandTierMultiplier;
    futurePrices.push({
      year: currentYear + i,
      price: Math.max(0, Math.round(futurePrice)),
    });
  }
  
  return {
    currentValue: Math.max(0, Math.round(currentValue)),
    originalPrice: input.originalPrice,
    depreciationRate,
    age,
    conditionMultiplier,
    brandTierMultiplier,
    futurePrices,
  };
}

/**
 * Format price in Indian Rupee format (₹1,25,000)
 */
export function formatIndianRupee(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
