import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import '../../css/items.css'; // Import CSS

export default function Items() {
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [tags, setTags] = useState([]); // Now stores objects: { value, filterType }
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching items from /api/item/all');
        const response = await axios.get("http://localhost:5000/api/item/all", {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Fetched data:', response.data);
        setItems(response.data);
        setDisplayedItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        // Axios error handling provides more detailed info
        const errorMessage = err.response 
          ? `Failed to fetch items: ${err.response.status} ${err.response.statusText} - ${err.response.data}`
          : err.message;
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddTag = () => {
    if (searchTerm && !tags.some(tag => tag.value === searchTerm && tag.filterType === filterType)) {
      const newTag = { value: searchTerm, filterType };
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setSearchTerm('');
      handleSearch(updatedTags);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => 
      !(tag.value === tagToRemove.value && tag.filterType === tagToRemove.filterType)
    );
    setTags(updatedTags);
    handleSearch(updatedTags);
  };

  const handleSearch = (currentTags) => {
    console.log('Searching with tags:', currentTags);
    
    const filteredItems = items.filter(item => {
      if (currentTags.length === 0) return true;

      console.log('Processing item:', item);

      const matchesTags = currentTags.some(tag => {
        const tagLower = tag.value.toLowerCase();
        const tagFilterType = tag.filterType;

        switch (tagFilterType) {
          case 'Category':
            return item.category?.toLowerCase().includes(tagLower) || 
                   item.Category?.toLowerCase().includes(tagLower);
          case 'ItemId':
            return String(item.itemId).includes(tagLower) || 
                   String(item.itemID).includes(tagLower);
          case 'ItemName':
            return item.name.toLowerCase().includes(tagLower) ||
                   item.Name?.toLowerCase().includes(tagLower);
          case 'IngredientId':
            return item.ingredients?.some(ing => 
              String(ing.ingredientId).includes(tagLower) || 
              String(ing.ingredientID).includes(tagLower)
            );
          case 'Ingredients':
            return item.ingredients?.some(ing => 
              ing.name.toLowerCase().includes(tagLower)
            );
          default: // 'All'
            return (
              (item.category?.toLowerCase().includes(tagLower) || 
               item.Category?.toLowerCase().includes(tagLower)) ||
              (String(item.itemId).includes(tagLower) || 
               String(item.itemID).includes(tagLower)) ||
              (item.name.toLowerCase().includes(tagLower) || 
               item.Name?.toLowerCase().includes(tagLower)) ||
              item.ingredients?.some(ing => 
                (String(ing.ingredientId).includes(tagLower) || 
                 String(ing.ingredientID).includes(tagLower)) ||
                ing.name.toLowerCase().includes(tagLower)
              )
            );
        }
      });

      return matchesTags;
    });

    console.log('Filtered items:', filteredItems);
    setDisplayedItems(filteredItems);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="items-container">
      <h1 className="items-header">Item Management</h1>
      
      <div className="items-table-container">
        <div className="items-table-header">
          <div className="search-container">
            <select 
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Category">Category</option>
              <option value="ItemId">Item ID</option>
              <option value="ItemName">Item Name</option>
              <option value="IngredientId">Ingredient ID</option>
              <option value="Ingredients">Ingredients</option>
            </select>
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleAddTag}>
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
          {tags.map(tag => (
            <span key={`${tag.value}-${tag.filterType}`} className="tag">
              {`${tag.filterType}: ${tag.value}`}
              <button className="tag-close" onClick={() => handleRemoveTag(tag)}>
                ✕
              </button>
            </span>
          ))}
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Item Id</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Ingredients Id</th>
              <th>Ingredients</th>
              <th>Volume</th>
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((item) => (
              item.ingredients?.length > 0 ? (
                item.ingredients.map((ing, index) => (
                  <tr key={`${item.itemId}-${index}`}>
                    {index === 0 && (
                      <>
                        <td rowSpan={item.ingredients.length}>{item.itemId}</td>
                        <td rowSpan={item.ingredients.length}>{item.name}</td>
                        <td rowSpan={item.ingredients.length}>{item.Category || item.category || 'N/A'}</td>
                      </>
                    )}
                    <td>{ing.ingredientId}</td>
                    <td>{ing.name}</td>
                    <td>{ing.volume || 'N/A'}</td>
                    <td>{ing.unit || 'N/A'}</td>
                    {index === 0 && (
                      <td rowSpan={item.ingredients.length}>
                        <div className="action-container">
                          <button className="edit-button">Edit</button>
                          <button className="delete-button">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr key={item.itemId}>
                  <td>{item.itemId}</td>
                  <td>{item.name}</td>
                  <td>{item.Category || item.category || 'N/A'}</td>
                  <td colSpan={4}>No ingredients</td>
                  <td>
                    <div className="action-container">
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}