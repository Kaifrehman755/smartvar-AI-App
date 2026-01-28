import pandas as pd
import numpy as np
import random

# Hum 5000 items ka dataset banayenge
NUM_SAMPLES = 5000

print(f"Generating {NUM_SAMPLES} realistic market items...")

data = []

for _ in range(NUM_SAMPLES):
    # 1. Random Input Features
    original_price = random.randint(5000, 300000)  # ₹5k se ₹3L ki range
    age = random.randint(0, 12)                    # 0 se 12 saal purana
    condition = random.randint(1, 5)               # 1 (Poor) to 5 (Excellent)
    brand_tier = random.randint(1, 3)              # 1 (Budget) to 3 (Premium)

    # 2. Realistic Logic with "Random Noise"
    # Real life mein math perfect nahi hoti, isliye hum 'random.uniform' use karenge
    # taaki prices thode upar-neeche hon (Market Fluctuation)
    
    depreciation_base = 0.85 ** age  # Har saal 15% value down
    condition_factor = 0.5 + (condition * 0.1) # Condition achi toh price zyada
    brand_factor = 0.8 + (brand_tier * 0.15)   # Brand bada toh price zyada
    
    # Market Noise (Randomness +/- 10%) - Yehi AI seekhega!
    market_fluctuation = random.uniform(0.90, 1.10) 

    resale_price = original_price * depreciation_base * condition_factor * brand_factor * market_fluctuation
    
    data.append([original_price, age, condition, brand_tier, int(resale_price)])

# DataFrame banao aur CSV save karo
df = pd.DataFrame(data, columns=['original_price', 'age', 'condition', 'brand_tier', 'resale_price'])
df.to_csv('market_data.csv', index=False)

print("✅ 'market_data.csv' created successfully with 5000 rows!")
print(df.head()) # Pehli 5 lines dikhao