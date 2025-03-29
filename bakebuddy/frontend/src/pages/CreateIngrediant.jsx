import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import axios from 'axios';
import '../../css/CreateIngredient.css';
import productionHeader from "../../images/ingredient_image.png";

const CreateIngredient = () => {
  const [formData, setFormData] = useState({
    name: '',
    maxUnits: '',
    minUnits: '',
    unitsType: 'pieces',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); // Added for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const dataToSend = {
        ...formData,
        maxUnits: Number(formData.maxUnits),
        minUnits: Number(formData.minUnits),
      };

      const response = await axios.post('http://localhost:5000/api/ingredients/create', dataToSend);
      setSuccess('Ingredient created successfully!');
      setFormData({
        name: '',
        maxUnits: '',
        minUnits: '',
        unitsType: 'pieces',
      });
      // Optional: Navigate after success (uncomment if desired)
      // setTimeout(() => navigate('/show-ingredient'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while creating the ingredient');
    }
  };

  const handleBack = () => {
    navigate('/show-ingredient'); // Adjust the route as needed
  };

  return (
    <>
      <div className="page-header">
                          <div className="page-header-image">
                            <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
                          </div>
                          <div className="page-header-title">Ingredients</div>
            </div>
      <div className="create-ingredient-main-container">
        <h2>Create New Ingredient</h2>
        {error && <div className="create-ingredient-error-message">{error}</div>}
        {success && <div className="create-ingredient-success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="create-ingredient-form-group">
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

          <div className="create-ingredient-form-group">
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

          <div className="create-ingredient-form-group">
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

          <div className="create-ingredient-form-group">
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

          <div className="create-ingredient-button-group">
            <button type="submit" className="create-ingredient-submit-button">
              Create Ingredient
            </button>
            <button type="button" className="create-ingredient-back-button" onClick={handleBack}>
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateIngredient;