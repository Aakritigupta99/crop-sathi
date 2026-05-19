"""
CropSathi - FastAPI ML Prediction Server
==========================================
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import numpy as np
import os

app = FastAPI(
    title="CropSathi ML API",
    description="AI Crop Recommendation Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
MODEL_PATH = "model/crop_model.pkl"
LABELS_PATH = "model/labels.pkl"

model = None
labels = []

@app.on_event("startup")
def load_model():
    global model, labels
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print("✅ ML model loaded successfully")
    else:
        print("⚠️  Model not found. Run train.py first.")

    if os.path.exists(LABELS_PATH):
        with open(LABELS_PATH, "rb") as f:
            labels = pickle.load(f)


# Crop metadata for rich response
CROP_INFO = {
    "rice":        {"emoji": "🌾", "season": "Kharif",  "water": "High",   "days": 120, "profit_per_acre": 28000},
    "wheat":       {"emoji": "🌿", "season": "Rabi",    "water": "Medium", "days": 120, "profit_per_acre": 22000},
    "maize":       {"emoji": "🌽", "season": "Kharif",  "water": "Medium", "days": 90,  "profit_per_acre": 20000},
    "chickpea":    {"emoji": "🫘", "season": "Rabi",    "water": "Low",    "days": 100, "profit_per_acre": 30000},
    "kidneybeans": {"emoji": "🫘", "season": "Kharif",  "water": "Medium", "days": 90,  "profit_per_acre": 25000},
    "pigeonpeas":  {"emoji": "🌱", "season": "Kharif",  "water": "Low",    "days": 180, "profit_per_acre": 18000},
    "mothbeans":   {"emoji": "🌱", "season": "Kharif",  "water": "Low",    "days": 75,  "profit_per_acre": 15000},
    "mungbean":    {"emoji": "🌿", "season": "Kharif",  "water": "Low",    "days": 65,  "profit_per_acre": 20000},
    "blackgram":   {"emoji": "🫘", "season": "Kharif",  "water": "Low",    "days": 80,  "profit_per_acre": 18000},
    "lentil":      {"emoji": "🫘", "season": "Rabi",    "water": "Low",    "days": 110, "profit_per_acre": 22000},
    "pomegranate": {"emoji": "🍎", "season": "Annual",  "water": "Low",    "days": 180, "profit_per_acre": 60000},
    "banana":      {"emoji": "🍌", "season": "Annual",  "water": "High",   "days": 300, "profit_per_acre": 75000},
    "mango":       {"emoji": "🥭", "season": "Summer",  "water": "Medium", "days": 365, "profit_per_acre": 50000},
    "grapes":      {"emoji": "🍇", "season": "Annual",  "water": "Medium", "days": 300, "profit_per_acre": 80000},
    "watermelon":  {"emoji": "🍉", "season": "Summer",  "water": "High",   "days": 90,  "profit_per_acre": 35000},
    "muskmelon":   {"emoji": "🍈", "season": "Summer",  "water": "Medium", "days": 85,  "profit_per_acre": 30000},
    "apple":       {"emoji": "🍏", "season": "Annual",  "water": "Medium", "days": 365, "profit_per_acre": 90000},
    "orange":      {"emoji": "🍊", "season": "Annual",  "water": "Medium", "days": 300, "profit_per_acre": 55000},
    "papaya":      {"emoji": "🍐", "season": "Annual",  "water": "Medium", "days": 300, "profit_per_acre": 40000},
    "coconut":     {"emoji": "🥥", "season": "Annual",  "water": "High",   "days": 365, "profit_per_acre": 45000},
    "cotton":      {"emoji": "🌸", "season": "Kharif",  "water": "Medium", "days": 180, "profit_per_acre": 32000},
    "jute":        {"emoji": "🌿", "season": "Kharif",  "water": "High",   "days": 120, "profit_per_acre": 15000},
    "coffee":      {"emoji": "☕", "season": "Annual",  "water": "High",   "days": 365, "profit_per_acre": 70000},
}


class CropInput(BaseModel):
    N: float = Field(..., description="Nitrogen content in soil (kg/ha)", ge=0, le=140)
    P: float = Field(..., description="Phosphorus content in soil (kg/ha)", ge=0, le=145)
    K: float = Field(..., description="Potassium content in soil (kg/ha)", ge=0, le=205)
    temperature: float = Field(..., description="Temperature in Celsius", ge=0, le=50)
    humidity: float = Field(..., description="Relative humidity %", ge=0, le=100)
    ph: float = Field(..., description="pH value of soil", ge=0, le=14)
    rainfall: float = Field(..., description="Rainfall in mm", ge=0, le=300)


class CropPrediction(BaseModel):
    recommended_crop: str
    confidence: float
    emoji: str
    season: str
    water_requirement: str
    days_to_harvest: int
    estimated_profit_per_acre: int
    top_3: list
    tip: str


@app.get("/")
def root():
    return {"status": "CropSathi ML API running ✅", "model_loaded": model is not None}


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict", response_model=CropPrediction)
def predict(data: CropInput):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="ML model not loaded. Please run train.py first and restart the server."
        )

    input_arr = np.array([[data.N, data.P, data.K,
                           data.temperature, data.humidity,
                           data.ph, data.rainfall]])

    # Get prediction + probabilities
    prediction = model.predict(input_arr)[0]
    proba = model.predict_proba(input_arr)[0]
    classes = model.classes_

    # Top 3 crops
    top_indices = np.argsort(proba)[::-1][:3]
    top_3 = [
        {
            "crop": classes[i],
            "confidence": round(float(proba[i]) * 100, 1),
            "emoji": CROP_INFO.get(classes[i], {}).get("emoji", "🌱")
        }
        for i in top_indices
    ]

    confidence = round(float(max(proba)) * 100, 1)
    info = CROP_INFO.get(prediction, {
        "emoji": "🌱", "season": "Kharif", "water": "Medium",
        "days": 100, "profit_per_acre": 20000
    })

    # Smart tip based on inputs
    tip = generate_tip(data, prediction)

    return CropPrediction(
        recommended_crop=prediction,
        confidence=confidence,
        emoji=info["emoji"],
        season=info["season"],
        water_requirement=info["water"],
        days_to_harvest=info["days"],
        estimated_profit_per_acre=info["profit_per_acre"],
        top_3=top_3,
        tip=tip
    )


def generate_tip(data: CropInput, crop: str) -> str:
    tips = []
    if data.ph < 6.0:
        tips.append("Your soil is acidic — add lime to balance pH before sowing.")
    elif data.ph > 7.5:
        tips.append("Your soil is alkaline — consider adding sulfur or organic compost.")
    if data.humidity > 80:
        tips.append("High humidity detected — watch for fungal diseases.")
    if data.rainfall < 50:
        tips.append("Low rainfall area — ensure proper irrigation system.")
    if data.N < 30:
        tips.append("Nitrogen is low — apply urea or DAP fertilizer.")
    if not tips:
        tips.append(f"{crop.capitalize()} is ideal for your soil and climate conditions. Happy farming! 🌾")
    return " ".join(tips)
