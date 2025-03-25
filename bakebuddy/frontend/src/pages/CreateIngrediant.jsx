import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/AddItems.css';

export default function AddItem() {
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ingredients/', {
          headers: { 'Content-Type': 'application/json' },
        });
        setValidIngredients(response.data);
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        setValidIngredients([]);
        setError(err.response?.data?.message || 'Failed to load ingredients. Please try again.');
      }
    };
    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewIngredientChange = (e) => {
    const { name, value } = e.target;
    // Allow manual entry for volume as a string, no immediate parsing
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
      const response = await axios.post(
        'http://localhost:5000/api/item/create',
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
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to create item');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
   
    



    <div className="add-item-container">
          


          <div className="page-header">
    <div className="page-header-image">
                     {/* <img src={itemHeader} alt="" className='' /> */}
                    </div>
                    <div className="page-header-title">Ingrediant</div>
         </div>        
    
                  
      <h1 className="add-item-header">Create Ingreediant</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ingredients Id :</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingredients Id"
              className="form-input"
              required
            />
          </div>
          
        </div>


        <div className="form-row">
        <div className="form-group">
            <label className="form-label">Add Ingrediant Name :</label>
            <input
              type="text"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              placeholder="Add Ingrediant Name"
              className="form-input"
              required
            />
          </div>
          </div>

        <div className="ingredients-section">
          <label className="form-label">Unit Section :</label>
          <div className="ingredients-input-row">
       
          <div className="form-row">
          <div className="form-group">
            <label className="form-label">Minimum Units :</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Minimum Units"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Maxumum Units :</label>
            <input
              type="text"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              placeholder="Maxumum Units"
              className="form-input"
              required
            />
          </div>
        </div>
          
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
          Create
        </button>
      </form>
    </div>
  );
}