import pandas as pd
import numpy as np
import random

# --- SETTINGS ---
NUM_SAMPLES = 5000  # Hum 5000 alag-alag products ka data banayenge

def generate_smart_data():
    data = []
    
    for _ in range(NUM_SAMPLES):
        # 1. Brand Tier (1=Cheap, 2=Mid, 3=Premium like Apple/Sony)
        brand_tier = random.choices([1, 2, 3], weights=[30, 40, 30])[0]
        
        # 2. Original Price (Tier ke hisaab se)
        if brand_tier == 1:
            original_price = random.randint(5000, 20000)  # Budget
        elif brand_tier == 2:
            original_price = random.randint(20000, 80000) # Mid-range
        else:
            original_price = random.randint(80000, 500000) # Premium (Laptop/High-end)

        # 3. Age (0 to 10 years)
        age = random.randint(0, 10)
        
        # 4. Condition (1=Bad to 5=New)
        condition = random.randint(1, 5)
        
        # --- INTELLIGENT DEPRECIATION LOGIC ---
        # Har saal kitni value kam hogi?
        # Premium brands (Tier 3) ki value dheere girti hai (approx 15%/yr)
        # Saste brands (Tier 1) ki value jaldi girti hai (approx 25%/yr)
        if brand_tier == 3:
            depreciation_rate = 0.15 
        elif brand_tier == 2:
            depreciation_rate = 0.20
        else:
            depreciation_rate = 0.25
            
        # Condition Factor: Condition kharab hai toh aur value giregi
        condition_factor = (5 - condition) * 0.05  # Har point kam hone par 5% extra loss
        
        total_depreciation = (depreciation_rate * age) + condition_factor
        
        # Max depreciation 90% hi ho sakti hai (kabaad bhi 10% ka bikta hai)
        if total_depreciation > 0.90:
            total_depreciation = 0.90
            
        # Calculate Resale Price
        resale_price = original_price * (1 - total_depreciation)
        
        # Thoda Random Noise (Market variation +/- 5%)
        noise = random.uniform(0.95, 1.05)
        resale_price = resale_price * noise
        
        # Logic check: Resale kabhi original se zyada nahi honi chahiye
        if resale_price > original_price:
            resale_price = original_price * 0.90 # Open box discount

        data.append([original_price, age, condition, brand_tier, round(resale_price, 2)])

    # DataFrame banao aur Save karo
    df = pd.DataFrame(data, columns=['original_price', 'age', 'condition', 'brand_tier', 'resale_price'])
    df.to_csv("market_data.csv", index=False)
    print(f"✅ Generated {NUM_SAMPLES} realistic market records!")

if __name__ == "__main__":
    generate_smart_data()