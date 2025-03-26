import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/production.css';
import toast from "react-hot-toast";

const ShowIngredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ingredients");
      setIngredients(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`);
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
          return String(ingredient.ingredientId).includes(term);
        case 'Name':
          return ingredient.name.toLowerCase().includes(term);
        case 'Units Type':
          return ingredient.unitsType.toLowerCase().includes(term);
        default:
          return (
            String(ingredient.ingredientId).includes(term) ||
            ingredient.name.toLowerCase().includes(term) ||
            ingredient.unitsType.toLowerCase().includes(term)
          );
      }
    });
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <div className="page-header">
        <div className="page-header-image">
                         {/* <img src={itemHeader} alt="" className='' /> */}
                        </div>
                        <div className="page-header-title">Ingrediant</div>
             </div>        
        <div className="items-container">

<div className="items-table-container">

<div className="items-header-container">
      <h1 className="items-header">Ingrediant Management</h1>
    </div>

    <div className="items-table-header">
      <div className="search-container">
        <select
          className="filter-select"
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
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
     <button className="search-button" onClick={setSearchTerm}>
              Search
            </button>
            </div>
      <div className="add-button-container">
            <button className="add-button" onClick={() => navigate('/add-item')}>
              Add +
            </button>
          </div>
          </div>

          <div className="tags-container">
          {/* {tags.map(tag => (
            <span key={`${tag.value}-${tag.filterType}`} className="tag">
              {`${tag.filterType}: ${tag.value}`}
              <button className="tag-close" onClick={() => handleRemoveTag(tag)}>
                ✕
              </button>
            </span>
          ))} */}
          </div>
      <table className="min-w-full bg-items border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Max Units</th>
            <th className="border px-4 py-2">Min Units</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Units Type</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {handleSearch().map((ingredient) => (
            <tr key={ingredient._id} className="border">
           
              <td className="border px-4 py-2">{ingredient.ingredientId}</td>
              <td className="border px-4 py-2">{ingredient.name}</td>
              <td className="border px-4 py-2">{ingredient.maxUnits}</td>
              <td className="border px-4 py-2">{ingredient.minUnits}</td>
              <td className="border px-4 py-2">{ingredient.ingredientQuantity}</td>
              <td className="border px-4 py-2">{ingredient.unitsType}</td>
              <td className="border px-4 py-2">
                <button className="delete-button" onClick={() => deleteIngredient(ingredient._id)}>Delete</button>
                <button className="edit-button" onClick={() => deleteIngredient(ingredient._id)}>Update</button>
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


