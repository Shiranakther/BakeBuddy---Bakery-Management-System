import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/UpdateItem.css';

export default function UpdateItem() {
  const navigate = useNavigate();
  const { itemId } = useParams(); // Get itemId from URL
  const [formData, setFormData] = useState({
    name: '',
    Category: '',
    description: '',
    ingredients: [],
  });
  const [newIngredient, setNewIngredient] = useState({
    ingredientId: '',
    name: '',
    volume: '', // Keep as string for manual input
    unit: '',
  });
  const [validIngredients, setValidIngredients] = useState([]);
  const [error, setError] = useState(null);
  const ingredientIdRef = useRef(null);

  // Fetch item data and ingredients on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch item details
        const itemResponse = await axios.get(`http://localhost:5000/api/item/all`);
        const item = itemResponse.data.find((i) => i.itemId === itemId);
        if (!item) throw new Error('Item not found');

        setFormData({
          name: item.name || '',
          Category: item.Category || '',
          description: item.description || '',
          ingredients: item.ingredients || [],
        });

        // Fetch available ingredients
        const ingredientsResponse = await axios.get('http://localhost:5000/api/ingredients/');
        setValidIngredients(ingredientsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load item data');
      }
    };
    fetchData();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewIngredientChange = (e) => {
    const { name, value } = e.target;
    // Keep volume as a string, no immediate parsing
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
    setError(null);

    if (name === 'ingredientId' && value) {
      const matchedIngredient = validIngredients.find((ing) =>
        ing.ingredientId.toLowerCase() === value.toLowerCase()
      );
      if (matchedIngredient) {
        setNewIngredient((prev) => ({
          ...prev,
          name: matchedIngredient.name,
          ingredientId: matchedIngredient.ingredientId,
        }));
      }
    } else if (name === 'name' && value) {
      const matchedIngredient = validIngredients.find((ing) =>
        ing.name.toLowerCase() === value.toLowerCase()
      );
      if (matchedIngredient) {
        setNewIngredient((prev) => ({
          ...prev,
          name: matchedIngredient.name,
          ingredientId: matchedIngredient.ingredientId,
        }));
      }
    }
  };

  const addIngredient = () => {
    if (
      !newIngredient.ingredientId ||
      !newIngredient.name ||
      !newIngredient.volume ||
      !newIngredient.unit
    ) {
      setError('Please fill in all ingredient fields');
      return;
    }

    const selectedIngredient = validIngredients.find((ing) =>
      ing.ingredientId.toLowerCase() === newIngredient.ingredientId.toLowerCase()
    );
    if (!selectedIngredient) {
      setError('Ingredient does not exist');
      return;
    }

    // Parse volume manually when adding
    const volume = parseFloat(newIngredient.volume);
    if (isNaN(volume) || volume < 0) {
      setError('Volume must be a valid positive number');
      return;
    }

    const ingredientToAdd = {
      ...newIngredient,
      name: selectedIngredient.name,
      volume: volume, // Store as number after validation
    };

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredientToAdd],
    }));

    setNewIngredient({ ingredientId: '', name: '', volume: '', unit: '' });
    setError(null);
    if (ingredientIdRef.current) ingredientIdRef.current.focus();
  };

  const deleteIngredient = (index) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients.splice(index, 1);
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.Category || formData.ingredients.length === 0) {
      setError('Please fill in all fields and add at least one ingredient');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/item/${itemId}`,
        {
          ...formData,
          ingredients: formData.ingredients.map((ing) => ({
            ...ing,
            volume: parseFloat(ing.volume), // Ensure volume is a number
          })),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setError(null);
      navigate('/items');
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="update-item-container">
      <h1 className="update-item-header">Update Item</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="update-item-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Item Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category:</label>
            <input
              type="text"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              placeholder="Category"
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="ingredients-section">
          <label className="form-label">Ingredients:</label>
          <div className="ingredients-input-row">
            <input
              ref={ingredientIdRef}
              type="text"
              name="ingredientId"
              value={newIngredient.ingredientId}
              onChange={handleNewIngredientChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingredient Id (e.g., ing001)"
              className="ingredients-input"
            />
            <input
              type="text"
              name="name"
              value={newIngredient.name}
              onChange={handleNewIngredientChange}
              onKeyPress={handleKeyPress}
              placeholder="Ingredient name"
              className="ingredients-input"
            />
            <input
              type="text" // Changed from "number" to "text" for manual entry
              name="volume"
              value={newIngredient.volume}
              onChange={handleNewIngredientChange}
              onKeyPress={handleKeyPress}
              placeholder="Volume (e.g., 0.75)"
              className="ingredients-input"
            />
            <select
              name="unit"
              value={newIngredient.unit}
              onChange={handleNewIngredientChange}
              onKeyPress={handleKeyPress}
              className="unit-select"
            >
              <option value="">Select</option>
              <option value="kg">kg</option>
              <option value="l">l</option>
              <option value="pieces">pieces</option>
            </select>
            <button type="button" onClick={addIngredient} className="add-button">
              Add +
            </button>
          </div>

          {formData.ingredients.length > 0 && (
            <table className="ingredients-table">
              <thead>
                <tr>
                  <th>Ingredient Id</th>
                  <th>Ingredient Name</th>
                  <th>Volume</th>
                  <th>Unit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formData.ingredients.map((ing, index) => (
                  <tr key={index}>
                    <td>{ing.ingredientId}</td>
                    <td>{ing.name}</td>
                    <td>{ing.volume}</td>
                    <td>{ing.unit}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteIngredient(index)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!formData.name || !formData.Category || formData.ingredients.length === 0}
        >
          Update
        </button>
      </form>
    </div>
  );
}