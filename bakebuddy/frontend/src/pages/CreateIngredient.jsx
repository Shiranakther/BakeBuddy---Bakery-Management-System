import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateIngredient = () => {
  const [ingredientData, setIngredientData] = useState({
    ingredientId: "",
    name: "",
    maxUnits: "",
    minUnits: "",
  });
  const [message, setMessage] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ingredients/view");
      setIngredientsList(response.data);
    } catch (error) {
      console.error("Error fetching ingredients data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngredientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/ingredients/create", ingredientData);
      setMessage("Ingredient added successfully!");
      setIngredientData({
        ingredientId: "",
        name: "",
        maxUnits: "",
        minUnits: "",
      });
      fetchIngredients();
    } catch (error) {
      setMessage("Error adding ingredient");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "2px 2px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Add New Ingredient</h2>
      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Ingredient ID:</label>
        <input type="text" name="ingredientId" value={ingredientData.ingredientId} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Ingredient Name:</label>
        <input type="text" name="name" value={ingredientData.name} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Maximum Units:</label>
        <input type="number" name="maxUnits" value={ingredientData.maxUnits} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Minimum Units:</label>
        <input type="number" name="minUnits" value={ingredientData.minUnits} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" }}>Add</button>
      </form>
    </div>
  );
};

export default CreateIngredient;
