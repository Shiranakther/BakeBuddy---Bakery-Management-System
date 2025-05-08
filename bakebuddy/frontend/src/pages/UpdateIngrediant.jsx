import React, { useState, useEffect } from 'react';
import axios from 'axios';
import productionHeader from "../../images/ingredient_image.png";
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/ingredients/UpdateIngredient.css'; // Reuse CreateIngredient.css
import toast from 'react-hot-toast'; // Optional: for success/error notifications

const UpdateIngredient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    maxUnits: '',
    minUnits: '',
    unitsType: 'pieces',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch ingredient data on mount
  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ingredients/${id}`);
        setFormData({
          name: response.data.name,
          maxUnits: response.data.maxUnits,
          minUnits: response.data.minUnits,
          unitsType: response.data.unitsType,
        });
      } catch (err) {
        setError('Failed to fetch ingredient');
      }
    };
    fetchIngredient();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!formData.name || !formData.maxUnits || !formData.minUnits) {
      setError('Please fill in all required fields');
      return;
    }
    if (Number(formData.minUnits) > Number(formData.maxUnits)) {
      setError('Minimum units cannot exceed maximum units');
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/ingredients/${id}`, formData);
      setSuccess('Ingredient updated successfully!');
      toast.success('Ingredient updated successfully!'); // Optional toast
      setTimeout(() => navigate('/show-ingredient'), 1000); // Navigate after 1s
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ingredient');
      toast.error(err.response?.data?.error || 'Failed to update ingredient'); // Optional toast
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/show-ingredient'); // Navigate to ShowIngredient
  };

  return (
    <>
     <div className="page-header">
                       <div className="page-header-image">
                         <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
                       </div>
                       <div className="page-header-title">Production</div>
                     </div>

    <div className="create-ingredient-container">
      <div className='update-ingredient-title'>Update Ingredient</div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="form-into" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter ingredient name"
            required
          />
        </div>
        <div className="form-group">
          <label>Maximum Units</label>
          <input
            name="maxUnits"
            type="number"
            value={formData.maxUnits}
            onChange={handleChange}
            placeholder="Enter maximum units"
            min="0"
            step="0.1"
            required
          />
        </div>
        <div className="form-group">
          <label>Minimum Units</label>
          <input
            name="minUnits"
            type="number"
            value={formData.minUnits}
            onChange={handleChange}
            placeholder="Enter minimum units"
            min="0"
            step="0.1"
            required
          />
        </div>
        <div className="form-group">
          <label>Unit Type</label>
          <select name="unitsType" value={formData.unitsType} onChange={handleChange}>
            <option value="pieces">Pieces</option>
            <option value="kg">Kg</option>
            <option value="liter">Liter</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">
            Update
          </button>
          <button type="button" className="back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UpdateIngredient;