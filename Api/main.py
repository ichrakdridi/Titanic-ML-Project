from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

# Initialiser l'application
app = FastAPI(
    title="Titanic Survival Prediction API",
    description="API pour prédire la survie des passagers du Titanic",
    version="1.0"
)

# Autoriser React (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle
model = joblib.load("/app/models/final_randomforest.pkl")

# Définir le format des données reçues
class Passenger(BaseModel):
    Pclass: int
    Sex: str
    Age: float
    SibSp: int
    Parch: int
    Fare: float
    Embarked: str

# ✅ Endpoint 1 : Health check
@app.get("/health")
def health():
    return {"status": "ok"}

# ✅ Endpoint 2 : Model info
@app.get("/model-info")
def model_info():
    return {
        "model": "RandomForest",
        "features": [
            "pclass", "sex", "age", "sibsp", "parch",
            "fare", "alone", "adult_male",
            "embarked_Q", "embarked_S", "family_size"
        ],
        "version": "1.0"
    }

# ✅ Endpoint 3 : Predict
@app.post("/predict")
def predict(passenger: Passenger):

    # Convertir en dictionnaire
    data = passenger.dict()

    # Mettre les clés en minuscules
    data = {k.lower(): v for k, v in data.items()}

    # Encoder sex (female=1, male=0)
    data["sex"] = 1 if data["sex"] == "female" else 0

    # Feature engineering
    data["family_size"] = data["sibsp"] + data["parch"] + 1
    data["alone"] = 1 if data["family_size"] == 1 else 0
    data["adult_male"] = 1 if (data["sex"] == 0 and data["age"] >= 18) else 0

    # Encoder embarked
    data["embarked_Q"] = 1 if data["embarked"] == "Q" else 0
    data["embarked_S"] = 1 if data["embarked"] == "S" else 0

    # Ordre exact attendu par le modèle
    columns_order = [
        "pclass", "sex", "age", "sibsp", "parch",
        "fare", "alone", "adult_male",
        "embarked_Q", "embarked_S", "family_size"
    ]

    # Créer DataFrame
    input_df = pd.DataFrame([data])[columns_order]

    # Prédiction + probabilité
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]

    return {
        "prediction": int(prediction),
        "probability": round(float(probability), 2),
        "survived": "Yes" if prediction == 1 else "No"
    }