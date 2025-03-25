import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateIngredientQuantity = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantityChange, setQuantityChange] = useState(''); // For the input field to add/deduct
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all ingredients on component mount
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ingredients');
        setIngredients(response.data);
      } catch (err) {
        setError('Failed to fetch ingredients');
      }
    };
    fetchIngredients();
  }, []);

  // Handle ingredient selection
  const handleIngredientChange = async (e) => {
    const ingredientId = e.target.value;
    setSelectedIngredientId(ingredientId);
    setError(null);
    setSuccess(null);
    setQuantityChange('');

    if (ingredientId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/ingredients/${ingredientId}`);
        setSelectedIngredient(response.data);
      } catch (err) {
        setError('Failed to fetch ingredient details');
        setSelectedIngredient(null);
      }
    } else {
      setSelectedIngredient(null);
    }
  };

  // Handle quantity change input
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setQuantityChange(value);
    }
  };

  // Handle add operation
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
      const response = await axios.put(`http://localhost:5000/api/ingredients/${selectedIngredientId}`, {
        ingredientQuantity: newQuantity
      });
      
      setSuccess(`Added ${quantityToAdd} ${selectedIngredient.unitsType}. New quantity: ${newQuantity}`);
      setQuantityChange('');
      setSelectedIngredient({ ...selectedIngredient, ingredientQuantity: newQuantity });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add quantity');
    }
  };

  // Handle deduct operation
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
      const response = await axios.put(`http://localhost:5000/api/ingredients/${selectedIngredientId}`, {
        ingredientQuantity: newQuantity
      });
      
      setSuccess(`Deducted ${quantityToDeduct} ${selectedIngredient.unitsType}. New quantity: ${newQuantity}`);
      setQuantityChange('');
      setSelectedIngredient({ ...selectedIngredient, ingredientQuantity: newQuantity });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deduct quantity');
    }
  };

  return (
    <div className="update-quantity-container">
      <h2>Update Ingredient Quantity</h2>
      
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green' }}>{success}</div>}

      <div className="form-group">
        <label>Ingredients ID</label>
        <select
          value={selectedIngredientId}
          onChange={handleIngredientChange}
          required
        >
          <option value="">Select Ingredients ID</option>
          {ingredients.map(ingredient => (
            <option key={ingredient._id} value={ingredient._id}>
              {ingredient.ingredientId}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Ingredients Name</label>
        <input
          type="text"
          value={selectedIngredient?.name || ''}
          readOnly
          placeholder="Select an ingredient"
        />
      </div>

      <div className="form-group inline-group">
        <div className="inline-field">
          <label>View Maximum Units</label>
          <input
            type="text"
            value={selectedIngredient?.maxUnits || ''}
            readOnly
            placeholder="Maximum Units"
          />
        </div>
        <div className="inline-field">
          <label>View Minimum Units</label>
          <input
            type="text"
            value={selectedIngredient?.minUnits || ''}
            readOnly
            placeholder="Minimum Units"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Unit</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="pieces"
              checked={selectedIngredient?.unitsType === 'pieces'}
              readOnly
            />
            pieces
          </label>
          <label>
            <input
              type="radio"
              value="kg"
              checked={selectedIngredient?.unitsType === 'kg'}
              readOnly
            />
            Kg
          </label>
          <label>
            <input
              type="radio"
              value="liter"
              checked={selectedIngredient?.unitsType === 'liter'}
              readOnly
            />
            L
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Current Quantity ({selectedIngredient?.unitsType || 'Unit'})</label>
        <input
          type="text"
          value={selectedIngredient?.ingredientQuantity || 0}
          readOnly
          placeholder="Current quantity"
        />
      </div>

      <div className="form-group">
        <label>Change Quantity ({selectedIngredient?.unitsType || 'Unit'})</label>
        <input
          type="number"
          value={quantityChange}
          onChange={handleQuantityChange}
          placeholder="Enter quantity to add/deduct"
          min="0"
          step="0.1"
          required
        />
      </div>

      <div className="button-group">
        <button type="button" className="add-button" onClick={handleAdd}>
          Add
        </button>
        <button type="button" className="deduct-button" onClick={handleDeduct}>
          Deduct
        </button>
      </div>

      <style jsx>{`
        .update-quantity-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        input[readOnly] {
          background-color: #f5f5f5;
        }
        .inline-group {
          display: flex;
          gap: 20px;
        }
        .inline-field {
          flex: 1;
        }
        .radio-group {
          display: flex;
          gap: 20px;
        }
        .radio-group label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: normal;
        }
        .button-group {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .add-button {
          background-color: #f5a623;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .add-button:hover {
          background-color: #e69520;
        }
        .deduct-button {
          background-color: #ff4444;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .deduct-button:hover {
          background-color: #cc0000;
        }
      `}</style>
    </div>
  );
};

export default UpdateIngredientQuantity;