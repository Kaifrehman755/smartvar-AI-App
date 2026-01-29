import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# 1. Data Load Karo
try:
    df = pd.read_csv("market_data.csv")
    print("✅ Data Loaded Successfully!")
except:
    print("❌ Error: Pehle 'python generate_data.py' chalao!")
    exit()

# 2. Features aur Target alag karo
X = df[['original_price', 'age', 'condition', 'brand_tier']]
y = df['resale_price']

# 3. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Model Training (Random Forest)
# n_estimators=100 matlab 100 decision trees mil kar faisla lenge (Zyada accurate)
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# 5. Accuracy Test
score = model.score(X_test, y_test)
print(f"🎯 Model Accuracy: {round(score * 100, 2)}%")

# 6. Model Save Karo
joblib.dump(model, "price_model.pkl")
print("💾 Model saved as 'price_model.pkl'")