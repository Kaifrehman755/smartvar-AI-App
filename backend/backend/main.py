from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, create_engine, Session
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os

# --- 1. Database Setup (SQLite) ---
# Ye table banayega jo user ki requests ko save karega
class ValuationLog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    original_price: float
    age: int
    condition: int
    brand_tier: int
    predicted_price: float

# Database file 'database.db' yahi banegi
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)

# --- 2. Load AI Model ---
# Check karte hain ki model file hai ya nahi
if not os.path.exists("price_model.pkl"):
    raise RuntimeError("Model file not found! Pehle 'python model_training.py' run karo.")

model = joblib.load("price_model.pkl")

# --- 3. App Setup ---
app = FastAPI()

# Frontend (React) ko allow karne ke liye settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production mein isse frontend URL se badal dena
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input Data Format (Jo React bhejea)
class ItemInput(BaseModel):
    original_price: float
    age: int
    condition: int  # 1-5 Scale
    brand_tier: int # 1-3 Scale

@app.get("/")
def read_root():
    return {"message": "SmartVar AI Server is Running!"}

@app.post("/predict")
def predict_price(item: ItemInput):
    # 1. AI ke liye data prepare karo
    input_data = pd.DataFrame([[
        item.original_price, 
        item.age, 
        item.condition, 
        item.brand_tier
    ]], columns=['original_price', 'age', 'condition', 'brand_tier'])
    
    # 2. Prediction lo
    prediction = model.predict(input_data)[0]
    
    # 3. Database mein save karo (Memory)
    with Session(engine) as session:
        log = ValuationLog(
            original_price=item.original_price, 
            age=item.age, 
            condition=item.condition,
            brand_tier=item.brand_tier,
            predicted_price=prediction
        )
        session.add(log)
        session.commit()
    
    # 4. Result return karo
    return {"estimated_price": round(prediction, 2)}