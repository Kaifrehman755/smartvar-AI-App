import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error
import joblib

print("--- 🧠 Advanced AI Training Started ---")

# 1. Load Real Data
try:
    df = pd.read_csv('market_data.csv')
    print(f"📂 Data Loaded: {len(df)} rows")
except FileNotFoundError:
    print("❌ Error: 'market_data.csv' nahi mili. Pehle 'generate_data.py' run karo!")
    exit()

# 2. Features (X) aur Target (y) alag karo
X = df[['original_price', 'age', 'condition', 'brand_tier']]
y = df['resale_price']

# 3. Train-Test Split (Professional Practice)
# Hum 80% data training ke liye rakhenge aur 20% test ke liye (Exam lene ke liye)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train the Model (Thoda heavy settings ke saath)
print("⏳ Training model on 4000 rows...")
model = RandomForestRegressor(n_estimators=200, max_depth=15, random_state=42)
model.fit(X_train, y_train)

# 5. Model ka Exam lo (Accuracy Check)
predictions = model.predict(X_test)
accuracy = r2_score(y_test, predictions) * 100
error_margin = mean_absolute_error(y_test, predictions)

print(f"\n✅ Training Complete!")
print(f"🎯 Model Accuracy Score: {accuracy:.2f}% (Jitna 100 ke paas, utna behtar)")
print(f"💰 Average Error Margin: ₹{int(error_margin)} (AI price mein itna upar-neeche ho sakta hai)")

# 6. Save the smarter brain
joblib.dump(model, "price_model.pkl")
print("💾 New 'price_model.pkl' saved.")