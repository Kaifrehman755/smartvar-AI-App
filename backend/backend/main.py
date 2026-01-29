from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import SQLModel, Field, create_engine, Session, select
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os

# --- 1. Database Setup (SQLite) ---
class ValuationLog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    original_price: float
    age: int
    condition: int
    brand_tier: int
    estimated_price: float  # Result save karenge

# Database file banegi
sqlite_url = "sqlite:///database.db"
engine = create_engine(sqlite_url)

# Table Create karo
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# --- 2. App Initialize ---
app = FastAPI()

# Server start hone par DB banao
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# --- 3. CORS Settings ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. Model Load ---
try:
    if os.path.exists("price_model.pkl"):
        model = joblib.load("price_model.pkl")
        print("✅ Model loaded successfully!")
    else:
        model = None
except Exception as e:
    print(f"❌ Model Loading Error: {e}")
    model = None

# --- 5. Input Data Format ---
class ValuationRequest(BaseModel):
    original_price: float
    age: int
    condition: int
    brand_tier: int

# --- 6. Routes ---

@app.get("/")
def read_root():
    return {"message": "SmartVal AI Server is Running with Database!"}

@app.post("/predict")
def predict_value(data: ValuationRequest):
    if model is None:
        return {"error": "Model not loaded."}

    # 1. Prediction Calculation
    input_data = pd.DataFrame({
        "original_price": [data.original_price],
        "age": [data.age],
        "condition": [data.condition],
        "brand_tier": [data.brand_tier]
    })
    
    prediction = model.predict(input_data)[0]

    # --- 🔒 Logic Lock (Correction) ---
    if prediction >= data.original_price:
        prediction = data.original_price * 0.85
    if prediction < 0:
        prediction = data.original_price * 0.10
    # ----------------------------------

    final_price = round(prediction, 2)

    # 2. Database mein Save karo (History) 💾
    with Session(engine) as session:
        log = ValuationLog(
            original_price=data.original_price,
            age=data.age,
            condition=data.condition,
            brand_tier=data.brand_tier,
            estimated_price=final_price
        )
        session.add(log)
        session.commit()

    # 3. Result bhejo (Frontend ke liye 'estimated_price' zaroori hai)
    return {"estimated_price": final_price}

# Naya Route: History dekhne ke liye
@app.get("/history")
def get_history():
    with Session(engine) as session:
        logs = session.exec(select(ValuationLog)).all()
        return logs