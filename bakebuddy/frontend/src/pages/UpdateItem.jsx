import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import '../../css/items/UpdateItem.css';

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
  const [ingredientIdSuggestions, setIngredientIdSuggestions] = useState([]); // New state for ID suggestions
  const [ingredientNameSuggestions, setIngredientNameSuggestions] = useState([]); // New state for name suggestions

  // Fetch item data and ingredients on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch item details
        const itemResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/all`);
        const item = itemResponse.data.find((i) => i.itemId === itemId);
        if (!item) throw new Error('Item not found');

        setFormData({
          name: item.name || '',
          Category: item.Category || '',
          description: item.description || '',
          ingredients: item.ingredients || [],
        });

        // Fetch available ingredients
        const ingredientsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/ingredients/`);
        setValidIngredients(ingredientsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load item data');
        toast.error(err.response?.data?.message || 'Failed to load item data'); // Error toast for fetch failure
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
    setNewIngredient((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setIngredientIdSuggestions([]); // Clear previous ID suggestions
    setIngredientNameSuggestions([]); // Clear previous name suggestions

    if (name === 'ingredientId' && value) {
      const lowercasedValue = value.toLowerCase();
      const suggestions = validIngredients.filter((ing) =>
        ing.ingredientId.toLowerCase().startsWith(lowercasedValue)
      );
      setIngredientIdSuggestions(suggestions.slice(0, 5)); // Limit to top 5 ID suggestions

      const matchedIngredient = validIngredients.find((ing) =>
        ing.ingredientId.toLowerCase() === lowercasedValue
      );
      if (matchedIngredient) {
        setNewIngredient((prev) => ({
          ...prev,
          name: matchedIngredient.name,
          ingredientId: matchedIngredient.ingredientId,
        }));
      } else {
        setNewIngredient((prev) => ({ ...prev, name: '' })); // Clear name if no exact ID match
      }
    } else if (name === 'name' && value) {
      const lowercasedValue = value.toLowerCase();
      const suggestions = validIngredients.filter((ing) =>
        ing.name.toLowerCase().startsWith(lowercasedValue)
      );
      setIngredientNameSuggestions(suggestions.slice(0, 5)); // Limit to top 5 name suggestions

      const matchedIngredient = validIngredients.find((ing) =>
        ing.name.toLowerCase() === lowercasedValue
      );
      if (matchedIngredient) {
        setNewIngredient((prev) => ({
          ...prev,
          name: matchedIngredient.name,
          ingredientId: matchedIngredient.ingredientId,
        }));
      } else {
        setNewIngredient((prev) => ({ ...prev, ingredientId: '' })); // Clear ID if no exact name match
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
      toast.error('Please fill in all ingredient fields'); // Error toast for incomplete fields
      return;
    }

    const ingredientExists = formData.ingredients.some(
      (ing) => ing.ingredientId.toLowerCase() === newIngredient.ingredientId.toLowerCase()
    );
    if (ingredientExists) {
      setError('This ingredient has already been added');
      toast.error('This ingredient has already been added'); // Error toast for duplicate
      return;
    }

    const selectedIngredient = validIngredients.find((ing) =>
      ing.ingredientId.toLowerCase() === newIngredient.ingredientId.toLowerCase()
    );
    if (!selectedIngredient) {
      setError('Ingredient does not exist');
      toast.error('Ingredient does not exist'); // Error toast for invalid ingredient
      return;
    }

    const volume = parseFloat(newIngredient.volume);
    if (isNaN(volume) || volume < 0) {
      setError('Volume must be a valid positive number');
      toast.error('Volume must be a valid positive number'); // Error toast for invalid volume
      return;
    }

    const ingredientToAdd = {
      ...newIngredient,
      name: selectedIngredient.name,
      volume: volume,
    };

    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredientToAdd],
    }));

    setNewIngredient({ ingredientId: '', name: '', volume: '', unit: '' });
    setError(null);
    setIngredientIdSuggestions([]); // Clear ID suggestions after adding
    setIngredientNameSuggestions([]); // Clear name suggestions after adding
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
      toast.error('Please fill in all fields and add at least one ingredient'); // Error toast for validation
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/item/${itemId}`,
        {
          ...formData,
          ingredients: formData.ingredients.map((ing) => ({
            ...ing,
            volume: parseFloat(ing.volume),
          })),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setError(null);
      toast.success(`Item "${formData.name}" (ID: ${itemId}) updated successfully!`); // Success toast
      navigate('/items');
    } catch (err) {
      console.error('Error updating item:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update item';
      setError(errorMessage);
      toast.error(errorMessage); // Error toast for update failure
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
        <div className="item-form-row">
          <div className="form-group-itemname">
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
          <div className="form-group-itemcategory">
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
            <div className="ingredient-input-with-suggestions">
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
              {ingredientIdSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {ingredientIdSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.ingredientId}
                      onClick={() => {
                        setNewIngredient({
                          ...newIngredient,
                          ingredientId: suggestion.ingredientId,
                          name: suggestion.name,
                        });
                        setIngredientIdSuggestions([]); // Clear ID suggestions after selection
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur(); // Remove focus from input
                        }
                      }}
                      className="suggestion-item"
                    >
                      {suggestion.ingredientId} - {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="ingredient-input-with-suggestions">
              <input
                type="text"
                name="name"
                value={newIngredient.name}
                onChange={handleNewIngredientChange}
                onKeyPress={handleKeyPress}
                placeholder="Ingredient name"
                className="ingredients-input"
              />
              {ingredientNameSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {ingredientNameSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.ingredientId}
                      onClick={() => {
                        setNewIngredient({
                          ...newIngredient,
                          ingredientId: suggestion.ingredientId,
                          name: suggestion.name,
                        });
                        setIngredientNameSuggestions([]); // Clear name suggestions after selection
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur(); // Remove focus from input
                        }
                      }}
                      className="suggestion-item"
                    >
                      {suggestion.name} - {suggestion.ingredientId}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="text"
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
      <Toaster /> {/* Add Toaster component for toast notifications */}
    </div>
  );
}