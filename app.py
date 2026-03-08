import streamlit as st
import joblib
import pandas as pd

# Charger le modèle
model = joblib.load("models/final_randomforest.pkl")

st.title("🚢 Titanic Survival Prediction")

st.write("Entrez les informations du passager :")

# Inputs utilisateur
pclass = st.selectbox("Passenger Class", [1, 2, 3])
sex = st.selectbox("Sex", ["male", "female"])
age = st.slider("Age", 0, 100, 25)
sibsp = st.number_input("Siblings/Spouses aboard", 0, 10, 0)
parch = st.number_input("Parents/Children aboard", 0, 10, 0)
fare = st.number_input("Fare", 0.0, 500.0, 50.0)
embarked = st.selectbox("Embarked", ["C", "Q", "S"])

# Créer DataFrame
input_data = pd.DataFrame({
    "pclass": [pclass],
    "sex": [sex],
    "age": [age],
    "sibsp": [sibsp],
    "parch": [parch],
    "fare": [fare],
    "embarked": [embarked]
})

# Bouton prédiction
if st.button("Predict"):
    prediction = model.predict(input_data)[0]

    if prediction == 1:
        st.success("🎉 The passenger would survive!")
    else:
        st.error("💀 The passenger would not survive.")