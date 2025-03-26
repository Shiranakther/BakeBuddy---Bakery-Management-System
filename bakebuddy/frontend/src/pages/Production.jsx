import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import '../../css/production.css'
import productionHeader from "../../images/production-page-header-image.png";
import toast, { Toaster } from "react-hot-toast";
import addButton from'../../images/add_button.png';



const Production = () => {
  const [productions, setProductions] = useState([]);
  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    date: "",
    quantity: "",
    remarks: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    fetchProductions();
    fetchItems();
    formData;
  }, []);

  // Fetch all items for suggestions
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/item/all");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const fetchProductions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/production");
      setProductions(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Suggest items based on product name or product code input
    if (name === "productCode" || name === "productName") {
      suggestItems(value);
    }
  };

  // Suggest items based on partial match of product name or product code
  const suggestItems = (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const filteredItems = items.filter((item) => {
      const itemCodeMatch = item.itemId.toLowerCase().includes(query.toLowerCase());
      const productNameMatch = item.name.toLowerCase().includes(query.toLowerCase());
      return itemCodeMatch || productNameMatch;
    });

    setSuggestions(filteredItems);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editingId) {
  //       await axios.put(`http://localhost:5000/api/production/${editingId}`, formData);
  //     } else {
  //       await axios.post("http://localhost:5000/api/production", formData);
  //     }
  //     setFormData({
  //       productCode: "",
  //       productName: "",
  //       date: "",
  //       quantity: "",
  //       remarks: "",
  //     });
  //     setEditingId(null);
  //     fetchProductions();
  //   } catch (error) {
  //     console.error("Error adding/updating production", error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if product code or product name exists in the items array
    const isProductValid = items.some((item) => 
      item.itemId === formData.productCode || item.name.toLowerCase() === formData.productName.toLowerCase()
    );
  
    if (!isProductValid) {
      // Show an error message if the product code or name is not valid
      toast.error("Error: Product code or product name is not available in the database.");
      return;
    }
  
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/production/${editingId}`, formData);

        toast.success("Production updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/production", formData);
        toast.success("Production added successfully!");
      }
  
      // Reset form data and clear editing state after submission
      setFormData({
        productCode: "",
        productName: "",
        date: "",
        quantity: "",
        remarks: "",
      });
      setEditingId(null);
      fetchProductions();
    } catch (error) {
      toast.error("Error adding/updating production.");
    }
  };
  

  const handleEdit = (prod) => {
    setFormData({
      productCode: prod.productCode,
      productName: prod.productName,
      date: prod.date ? prod.date.split("T")[0] : "", 
      quantity: prod.quantity,
      remarks: prod.remarks,
    });
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/production/${id}`);
      toast.success("Production deleted successfully.");
      fetchProductions();
    } catch (error) {
    console.error("Error deleting production", error);
    toast.error("Error deleting production.");
    }
  };

  const handleSuggestionSelect = (item) => {

    setFormData({
      ...formData,
      productCode: item.itemId,
      productName: item.name,
    });
    setSuggestions([]);
    toast.success("Product selected successfully!");
  };

  return (
    <div className="production-container">
      <Toaster />
      <div className="page-header">
              <div className="page-header-image">
                <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
              </div>
              <div className="page-header-title">Production</div>
            </div>
      
      <form onSubmit={handleSubmit} className="production-form">
        
        <div className="production-details-wrapper-container">
        <div className="production-details-wrapper">
        <label>Product Code</label>
        <input
          type="text"
          name="productCode"
          placeholder="Product Code"
          value={formData.productCode}
          onChange={handleChange}
          className="production-details"
          required
        />
        </div>
        
        
        <div className="production-details-wrapper">
        <label>Product Name</label>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="production-details"
          required
        />
        </div>
    </div>

    <div className="production-details-wrapper-container">
        <div className="production-details-wrapper">

        {suggestions.length > 0 ? 
        
        (
          
  <ul className="suggestions-list">
          {suggestions.map((item) => (
            <li
              key={item.itemId}
              onClick={() => handleSuggestionSelect(item)}
            >
             {item.itemId} - {item.name} 
            </li>
          ))}
        </ul>
      ):null }

      </div>
      </div>

    <div className="production-details-wrapper-container">
        
    <div className="production-details-wrapper">
    <label>Production Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="production-details"
          disabled={editingId !== null} 
        />
        </div>


        <div className="production-details-wrapper">
        <label> Quantity</label>
        <input
          type="number"
          name="quantity"
          placeholder="Production Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="production-details"
          required
        />
        </div>


        <div className="production-details-wrapper">
        <label> Remarks</label>
        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="production-details"
        />
        </div>

        
    </div>

        <div className="production-details-wrapper-container">
        <div className="production-details-wrapper">
          
        <button type="submit" className={`production-button ${editingId ? "update-mode" : "add-mode"}`}>
          {editingId ? "Update" : "Add"} Production
          <img src={addButton} alt="add-icon" />
        </button>

          </div>
        </div>
        
      </form>



      <div className="production-history">
  <div>Production Insights</div>
  <div className="production-history-date">Today - {new Date().toLocaleDateString()}</div>
</div>

      
<div className="production-table-wrapper">
<table className="production-table">
  <thead>
    <tr>
      <th>Product Code</th>
      <th>Product Name</th>
      <th>Production Date</th>
      <th>Quantity</th>
      <th>Remarks</th>
      <th>Last Update</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {productions.filter((prod) => {
      const today = new Date().toISOString().split("T")[0];
      return prod.date && prod.date.split("T")[0] === today;
    }).length === 0 ? (
      <tr>
        <td colSpan="7" className="no-results">No results found</td>
      </tr>
    ) : (
      productions
        .filter((prod) => {
          const today = new Date().toISOString().split("T")[0];
          return prod.date && prod.date.split("T")[0] === today;
        })
        .map((prod) => (
          <tr key={prod._id}>
            <td>{prod.productCode}</td>
            <td>{prod.productName}</td>
            <td>{prod.date ? prod.date.split("T")[0] : "N/A"}</td>
            <td>{prod.quantity}</td>
            <td>{prod.remarks}</td>
            <td>
              {prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "N/A"}
            </td>
            <td>
              <div className="action-buttons">
                <button onClick={() => handleEdit(prod)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(prod._id)} className="delete-btn">Delete</button>
              </div>
            </td>
          </tr>
        ))
    )}
  </tbody>
</table>

</div>

    </div>
  );
};

export default Production;
