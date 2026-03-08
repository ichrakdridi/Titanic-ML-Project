import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    Pclass: 3,
    Sex: "male",
    Age: 22,
    SibSp: 1,
    Parch: 0,
    Fare: 7.25,
    Embarked: "S",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Pclass: Number(formData.Pclass),
          Age: Number(formData.Age),
          SibSp: Number(formData.SibSp),
          Parch: Number(formData.Parch),
          Fare: Number(formData.Fare),
        }),
      });

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError("Erreur de connexion à l'API !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      fontFamily: "Arial"
    }}>
      <h1 style={{ textAlign: "center" }}>🚢 Titanic Survival Prediction</h1>

      <form onSubmit={handleSubmit}>

        {/* Pclass */}
        <div style={{ marginBottom: "15px" }}>
          <label>Passenger Class</label>
          <select name="Pclass" onChange={handleChange} style={inputStyle}>
            <option value={1}>1st Class</option>
            <option value={2}>2nd Class</option>
            <option value={3}>3rd Class</option>
          </select>
        </div>

        {/* Sex */}
        <div style={{ marginBottom: "15px" }}>
          <label>Sex</label>
          <select name="Sex" onChange={handleChange} style={inputStyle}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div style={{ marginBottom: "15px" }}>
          <label>Age</label>
          <input
            name="Age"
            type="number"
            defaultValue={22}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* SibSp */}
        <div style={{ marginBottom: "15px" }}>
          <label>Siblings/Spouses</label>
          <input
            name="SibSp"
            type="number"
            defaultValue={1}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Parch */}
        <div style={{ marginBottom: "15px" }}>
          <label>Parents/Children</label>
          <input
            name="Parch"
            type="number"
            defaultValue={0}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Fare */}
        <div style={{ marginBottom: "15px" }}>
          <label>Fare</label>
          <input
            name="Fare"
            type="number"
            defaultValue={7.25}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Embarked */}
        <div style={{ marginBottom: "15px" }}>
          <label>Embarked</label>
          <select name="Embarked" onChange={handleChange} style={inputStyle}>
            <option value="S">Southampton</option>
            <option value="C">Cherbourg</option>
            <option value="Q">Queenstown</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {/* Erreur */}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {/* Résultat */}
      {prediction !== null && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          backgroundColor: prediction.prediction === 1 ? "#d4edda" : "#f8d7da"
        }}>
          <h2>{prediction.survived === "Yes" ? "🎉 Survived!" : "💀 Did Not Survive"}</h2>
          <p>Probability : <strong>{(prediction.probability * 100).toFixed(0)}%</strong></p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

export default App;