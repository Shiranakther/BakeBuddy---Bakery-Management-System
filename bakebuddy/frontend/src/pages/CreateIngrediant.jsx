import React, { useState } from 'react';
import axios from 'axios';

const CreateIngredient = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    maxUnits: '',
    minUnits: '',
    unitsType: 'pieces'
  });

  // State for handling errors and success messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Convert string numbers to actual numbers
      const dataToSend = {
        ...formData,
        maxUnits: Number(formData.maxUnits),
        minUnits: Number(formData.minUnits)
      };

      // Make API call to create ingredient
      const response = await axios.post('http://localhost:5000/api/ingredients/', dataToSend);
      
      setSuccess('Ingredient created successfully!');
      // Reset form
      setFormData({
        name: '',
        maxUnits: '',
        minUnits: '',
        unitsType: 'pieces'
      });
      
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while creating the ingredient');
    }
  };

  return (
    <div className="create-ingredient-container">
      <h2>Create New Ingredient</h2>
      
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ingredient Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter ingredient name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxUnits">Maximum Units:</label>
          <input
            type="number"
            id="maxUnits"
            name="maxUnits"
            value={formData.maxUnits}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter maximum units"
          />
        </div>

        <div className="form-group">
          <label htmlFor="minUnits">Minimum Units:</label>
          <input
            type="number"
            id="minUnits"
            name="minUnits"
            value={formData.minUnits}
            onChange={handleChange}
            required
            min="0"
            placeholder="Enter minimum units"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitsType">Units Type:</label>
          <select
            id="unitsType"
            name="unitsType"
            value={formData.unitsType}
            onChange={handleChange}
          >
            <option value="pieces">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="liter">Liters</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Create Ingredient
        </button>
      </form>

      <style jsx>{`
        .create-ingredient-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
        }
        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .submit-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .submit-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default CreateIngredient;