from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os

# --- 1. App Initialize ---
app = FastAPI()

# --- 2. CORS Settings (Frontend connection ke liye) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Sabhi ko allow karo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Model Load ---
# Model file load karte hain
try:
    if os.path.exists("price_model.pkl"):
        model = joblib.load("price_model.pkl")
        print("✅ Model loaded successfully!")
    else:
        print("❌ Error: price_model.pkl nahi mili")
        model = None
except Exception as e:
    print(f"❌ Model Loading Error: {e}")
    model = None

# --- 4. Input Data Format ---
class ValuationRequest(BaseModel):
    original_price: float
    age: int
    condition: int
    brand_tier: int

# --- 5. Routes ---

@app.get("/")
def read_root():
    return {"message": "SmartVal AI Server is Running!"}

@app.post("/predict")
def predict_value(data: ValuationRequest):
    if model is None:
        return {"error": "Model not loaded. Server check karo."}

    # 1. Data ko DataFrame mein badlo
    input_data = {
        "original_price": [data.original_price],
        "age": [data.age],
        "condition": [data.condition],
        "brand_tier": [data.brand_tier]
    }
    input_df = pd.DataFrame(input_data)

    # 2. Prediction (AI Model se)
    prediction = model.predict(input_df)[0]
    
    # --- 🔒 LOGIC LOCK (Correction Logic) ---
    # Agar AI ne galti se value Original se zyada bata di:
    if prediction >= data.original_price:
        prediction = data.original_price * 0.85  # Max 85% limit
    
    # Agar prediction negative (-) chali jaye:
    if prediction < 0:
        prediction = data.original_price * 0.10  # Min 10% limit
    # ----------------------------------------

    return {"predicted_price": round(prediction, 2)}