"""
CropSathi - ML Model Training Script
=====================================
Dataset: Kaggle Crop Recommendation Dataset
Download from: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset
Place Crop_recommendation.csv in this folder, then run: python train.py
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import pickle
import os

CSV_PATH = "Crop_recommendation.csv"

if not os.path.exists(CSV_PATH):
    print("❌ Crop_recommendation.csv not found!")
    print("📥 Download from: https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset")
    print("   Then place it in the ml-api/ folder and run this script again.")
    exit(1)

print("📊 Loading dataset...")
df = pd.read_csv(CSV_PATH)
print(f"   Rows: {len(df)}, Columns: {list(df.columns)}")
print(f"   Crops: {sorted(df['label'].unique())}")

# Features and target
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n🌱 Training RandomForest on {len(X_train)} samples...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy: {acc*100:.2f}%")

# Save model
os.makedirs("model", exist_ok=True)
with open("model/crop_model.pkl", "wb") as f:
    pickle.dump(model, f)

# Save label list for reference
labels = sorted(df['label'].unique().tolist())
with open("model/labels.pkl", "wb") as f:
    pickle.dump(labels, f)

print(f"💾 Model saved to model/crop_model.pkl")
print(f"📋 Labels saved to model/labels.pkl")
print(f"\n🚀 Now run: uvicorn main:app --reload")
