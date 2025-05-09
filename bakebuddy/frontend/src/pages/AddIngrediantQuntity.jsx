import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import productionHeader from "../../images/ingredient_image.png";
import '../../css/ingredients/UpdateIngredientQuantity.css';

const UpdateIngredientQuantity = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantityChange, setQuantityChange] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ingredients`);
        setIngredients(response.data);
      } catch (err) {
        setError('Failed to fetch ingredients');
      }
    };
    fetchIngredients();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setError(null);
    setSuccess(null);
    setQuantityChange('');
    setSelectedIngredient(null);
    setSelectedIngredientId('');

    const matched = ingredients.find(
      (ing) =>
        ing.name.toLowerCase().includes(value.toLowerCase()) ||
        ing.ingredientId.toLowerCase().includes(value.toLowerCase())
    );

    if (matched) {
      setSelectedIngredientId(matched._id);
      setSelectedIngredient(matched);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setQuantityChange(value);
    }
  };

  const handleAdd = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedIngredientId || !quantityChange) {
      setError('Please select an ingredient and enter a quantity to add');
      return;
    }

    const quantityToAdd = Number(quantityChange);
    const newQuantity = (selectedIngredient.ingredientQuantity || 0) + quantityToAdd;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/ingredients/${selectedIngredientId}`, {
        ingredientQuantity: newQuantity,
      });
      setSuccess(`Added ${quantityToAdd} ${selectedIngredient.unitsType}. New quantity: ${newQuantity}`);
      setQuantityChange('');
      setSelectedIngredient({ ...selectedIngredient, ingredientQuantity: newQuantity });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add quantity');
    }
  };

  const handleDeduct = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedIngredientId || !quantityChange) {
      setError('Please select an ingredient and enter a quantity to deduct');
      return;
    }

    const quantityToDeduct = Number(quantityChange);
    const currentQuantity = selectedIngredient.ingredientQuantity || 0;
    const newQuantity = currentQuantity - quantityToDeduct;

    if (newQuantity < 0) {
      setError('Cannot deduct more than the current quantity');
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/ingredients/${selectedIngredientId}`, {
        ingredientQuantity: newQuantity,
      });
      setSuccess(`Deducted ${quantityToDeduct} ${selectedIngredient.unitsType}. New quantity: ${newQuantity}`);
      setQuantityChange('');
      setSelectedIngredient({ ...selectedIngredient, ingredientQuantity: newQuantity });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deduct quantity');
    }
  };

  const handleBack = () => {
    navigate('/show-ingredient');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
        </div>
        <div className="page-header-title">Ingredients</div>
      </div>

      <div className="ingredient-update-main-container">
        <h2 className="ingredient-update-title">Update Ingredient Quantity</h2>

        {error && <div className="ingredient-update-error-message">{error}</div>}
        {success && <div className="ingredient-update-success-message">{success}</div>}

        <div className="ingredient-update-form-group">
          <label className="ingredient-update-label">Search Ingredient (Name or ID)</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Type to search ingredient..."
            className="ingredient-update-input"
            list="ingredient-options"
          />
          <datalist id="ingredient-options">
            {ingredients.map((ingredient) => (
              <option key={ingredient._id} value={ingredient.name}>
                {ingredient.ingredientId}
              </option>
            ))}
          </datalist>
        </div>

        <div className="ingredient-update-form-group">
          <label className="ingredient-update-label">Ingredient Name</label>
          <input
            type="text"
            value={selectedIngredient?.name || ''}
            readOnly
            className="ingredient-update-input ingredient-update-readonly"
          />
        </div>

        <div className="ingredient-update-form-group ingredient-update-inline-group">
          <div className="ingredient-update-inline-field">
            <label className="ingredient-update-label">Maximum Units</label>
            <input
              type="text"
              value={selectedIngredient?.maxUnits || ''}
              readOnly
              className="ingredient-update-input ingredient-update-readonly"
            />
          </div>
          <div className="ingredient-update-inline-field">
            <label className="ingredient-update-label">Minimum Units</label>
            <input
              type="text"
              value={selectedIngredient?.minUnits || ''}
              readOnly
              className="ingredient-update-input ingredient-update-readonly"
            />
          </div>
        </div>

        <div className="ingredient-update-form-group">
          <label className="ingredient-update-label">Unit</label>
          <div className="ingredient-update-radio-group">
            <label className="ingredient-update-radio-label">
              <input
                type="radio"
                value="pieces"
                checked={selectedIngredient?.unitsType === 'pieces'}
                readOnly
              />
              Pieces
            </label>
            <label className="ingredient-update-radio-label">
              <input
                type="radio"
                value="kg"
                checked={selectedIngredient?.unitsType === 'kg'}
                readOnly
              />
              Kg
            </label>
            <label className="ingredient-update-radio-label">
              <input
                type="radio"
                value="liter"
                checked={selectedIngredient?.unitsType === 'liter'}
                readOnly
              />
              Liter
            </label>
          </div>
        </div>

        <div className="ingredient-update-form-group">
          <label className="ingredient-update-label">Current Quantity ({selectedIngredient?.unitsType || 'Unit'})</label>
          <input
            type="text"
            value={selectedIngredient?.ingredientQuantity || 0}
            readOnly
            className="ingredient-update-input ingredient-update-readonly"
          />
        </div>

        <div className="ingredient-update-form-group">
          <label className="ingredient-update-label">Change Quantity ({selectedIngredient?.unitsType || 'Unit'})</label>
          <input
            type="number"
            value={quantityChange}
            onChange={handleQuantityChange}
            placeholder="Enter quantity to add/deduct"
            min="0"
            step="0.1"
            required
            className="ingredient-update-input"
          />
        </div>

        <div className="ingredient-update-button-group">
          <button type="button" className="ingredient-update-add-btn" onClick={handleAdd}>
            Add
          </button>
          <button type="button" className="ingredient-update-deduct-btn" onClick={handleDeduct}>
            Deduct
          </button>
          <button type="button" className="ingredient-update-back-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateIngredientQuantity;
