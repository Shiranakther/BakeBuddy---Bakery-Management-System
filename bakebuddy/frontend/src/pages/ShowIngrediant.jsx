import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import '../../css/ingredients/ShowIngrediant.css';
import toast from "react-hot-toast";
import productionHeader from "../../images/ingredient_image.png";


const ShowIngredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIngredients();
    fetchUserRole();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ingredients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIngredients(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || 'supervisor');
      } catch (err) {
        console.error('Token decode error:', err);
        setUserRole('supervisor');
      }
    } else {
      setUserRole('supervisor');
    }
  };

  const deleteIngredient = async (id) => {
    if (userRole !== 'admin') {
      toast.error('Only Admins can delete ingredients.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ingredient with ID ${id}?`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ingredients/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success("Ingredient deleted successfully!");
      fetchIngredients();
    } catch (error) {
      toast.error("Error deleting ingredient");
    }
  };

  const handleSearch = () => {
    return ingredients.filter(ingredient => {
      const term = searchTerm.toLowerCase();
      switch (filterType) {
        case 'Ingredient ID':
          return String(ingredient.ingredientId).toLowerCase().includes(term);
        case 'Name':
          return ingredient.name.toLowerCase().includes(term);
        case 'Units Type':
          return ingredient.unitsType.toLowerCase().includes(term);
        default:
          return (
            String(ingredient.ingredientId).toLowerCase().includes(term) ||
            ingredient.name.toLowerCase().includes(term) ||
            ingredient.unitsType.toLowerCase().includes(term)
          );
      }
    });
  };

  const handleAddIngredient = () => {
    navigate('/create-ingrediant');
  };

  const handleUpdateIngredient = (id) => {
    navigate(`/update-ingredient/${id}`);
  };

  const handleUpdateQuantity = () => {
    navigate('/update-ingredient-quantity');
  };

  const handleGenerateReport = () => {
    navigate('/show-ingredient-report');
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error: {error}</p>;

  const isSupervisor = userRole === 'supervisor';

  return (
    <>
      <div className="page-header">
                    <div className="page-header-image">
                      <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
                    </div>
                    <div className="page-header-title">Ingredients</div>
      </div>
      <div className="show-ingredient-items-container">
        <div className="show-ingredient-items-table-container">
          <div className="show-ingredient-items-header-container">
            <h1 className="show-ingredient-items-header">Ingredient Management</h1>
          </div>

          <div className="show-ingredient-items-table-header">
            <div className="show-ingredient-search-container">
              <select
                className="show-ingredient-filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Ingredient ID">Ingredient ID</option>
                <option value="Name">Name</option>
                <option value="Units Type">Units Type</option>
              </select>
              <input
                type="text"
                placeholder="Search"
                className="show-ingredient-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="show-ingredient-search-button">Search</button>
            </div>
            <div className="show-ingredient-add-button-container">
              <button className="show-ingredient-add-button" onClick={handleAddIngredient}>
                Add +
              </button>
              <button className="show-ingredient-update-quantity-button" onClick={handleUpdateQuantity}>
                Update Quantity
              </button>
              <button className="show-ingredient-generate-report-button" onClick={handleGenerateReport}>
                Generate Report
              </button>
            </div>
          </div>

          <table className="show-ingredient-min-w-full show-ingredient-bg-items">
            <thead className="show-ingredient-thead">
              <tr>
                <th className="show-ingredient-th">ID</th>
                <th className="show-ingredient-th">Name</th>
                <th className="show-ingredient-th">Max Units</th>
                <th className="show-ingredient-th">Min Units</th>
                <th className="show-ingredient-th">Quantity</th>
                <th className="show-ingredient-th">Units Type</th>
                <th className="show-ingredient-th">Actions</th>
              </tr>
            </thead>
            <tbody className="show-ingredient-tbody">
              {handleSearch().map((ingredient) => (
                <tr key={ingredient._id}>
                  <td className="show-ingredient-td">{ingredient.ingredientId}</td>
                  <td className="show-ingredient-td">{ingredient.name}</td>
                  <td className="show-ingredient-td">{ingredient.maxUnits}</td>
                  <td className="show-ingredient-td">{ingredient.minUnits}</td>
                  <td className="show-ingredient-td">{ingredient.ingredientQuantity.toFixed(2)}</td>
                  <td className="show-ingredient-td">{ingredient.unitsType}</td>
                  <td className="show-ingredient-td">
                    <button
                      className="show-ingredient-edit-button"
                      onClick={() => handleUpdateIngredient(ingredient._id)}
                    >
                      Update
                    </button>
                    <button
                      className={`show-ingredient-delete-button ${isSupervisor ? 'disabled' : ''}`}
                      onClick={() => deleteIngredient(ingredient._id)}
                      disabled={isSupervisor}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ShowIngredient;