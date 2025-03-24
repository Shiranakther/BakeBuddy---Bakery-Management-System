import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import '../../css/production.css'
import productionHeader from "../../images/production-page-header-image.png";


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/production/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/production", formData);
      }
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
      console.error("Error adding/updating production", error);
    }
  };

  const handleEdit = (prod) => {
    setFormData({
      productCode: prod.productCode,
      productName: prod.productName,
      date: prod.date,
      quantity: prod.quantity,
      remarks: prod.remarks,
    });
    setEditingId(prod._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/production/${id}`);
      fetchProductions();
    } catch (error) {
      console.error("Error deleting production", error);
    }
  };

  const handleSuggestionSelect = (item) => {
    setFormData({
      ...formData,
      productCode: item.itemId,
      productName: item.name,
    });
    setSuggestions([]);
  };

  return (
    <div className="p-6">
      <div className="page-header">
              <div className="page-header-image">
                <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' />
              </div>
              <div className="page-header-title">Production</div>
            </div>
      <h1 className="text-2xl font-bold mb-4">Production Dashboard</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          name="productCode"
          placeholder="Product Code"
          value={formData.productCode}
          onChange={handleChange}
          className="border p-2"
          required
        />
        

        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="border p-2"
          required
        />
        
        {suggestions.length > 0 && (
          <ul >
            {suggestions.map((item) => (
              <li
              key={item.itemId}
              onClick={() => handleSuggestionSelect(item)}
              
            >
              {item.name} - {item.itemId}
            </li>
            
            ))}
          </ul>
        )}
    

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border p-2"
          required
        />

        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="border p-2"
        />

        <button type="submit" className="bg-blue-500 text-white p-2">
          {editingId ? "Update" : "Add"} Production
        </button>
      </form>

      <table className="production-table">
  <thead>
    <tr>
      <th>Product Code</th>
      <th>Product Name</th>
      <th>Date</th>
      <th>Quantity</th>
      <th>Remarks</th>
      <th>Actions</th>
      <th>Send Id</th>
    </tr>
  </thead>
  <tbody>
    {productions.map((prod) => (
      <tr key={prod._id}>
        <td>{prod.productCode}</td>
        <td>{prod.productName}</td>
        <td>{prod.date}</td>
        <td>{prod.quantity}</td>
        <td>{prod.remarks}</td>
        <td>
          <button onClick={() => handleEdit(prod)} className="edit-btn">Edit</button>
          <button onClick={() => handleDelete(prod._id)} className="delete-btn">Delete</button>
        </td>
        <td>
              <button onClick={() => navigate(`/smartbake/${prod._id}`)}>Send id</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Production;
