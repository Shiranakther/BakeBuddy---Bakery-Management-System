import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SalesCreate = () => {
  const [salesData, setSalesData] = useState({
    date: "",
    itemCode: "",
    itemName: "",
    buyerName: "",
    salesQuentity: "",
  });
  const [message, setMessage] = useState("");
  const [salesList, setSalesList] = useState([]);
  const [items, setItems] = useState([]);  // New state to store all items from the database
  const [searchColumn, setSearchColumn] = useState("itemCode"); // Default column to search
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const navigate = useNavigate();

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00 to compare date only
    return today.toISOString().split('T')[0]; // Return only the date part
  };

  useEffect(() => {
    fetchSalesData();
    fetchItems();  // Fetch all items data when the component mounts
    const interval = setInterval(fetchSalesData, 60000); // Fetch data every 60 seconds
    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/sales/view");

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ensure the time is set to midnight

      const filteredSales = response.data.filter(sale => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0); // Normalize sale date

        return saleDate.getTime() === today.getTime(); // Compare as timestamps
      });

      setSalesList(filteredSales);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/item/all");  // Endpoint to fetch all items
      setItems(response.data);  // Set all the items in state
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSearch = () => {
    // Filter salesList based on the selected column and search term
    const filteredSales = salesList.filter((sale) => {
      return sale[searchColumn]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });

    setSalesList(filteredSales);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "itemCode") {
      const selectedItem = items.find(item => item.itemId === value);  // Find item by itemId (itemCode)
      if (selectedItem) {
        setSalesData(prevData => ({
          ...prevData,
          itemCode: value,
          itemName: selectedItem.name,  // Populate itemName with the selected item's name
        }));
      } else {
        setSalesData(prevData => ({
          ...prevData,
          itemCode: value,
          itemName: "",  // If no item found, clear itemName
        }));
      }
    } else {
      setSalesData(prevData => ({
        ...prevData,
        [name]: value,  // For all other fields, just update the value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/sales/create", salesData);
      toast.success("Sales record added successfully!"); // Success notification
      setSalesData({
        date: "",
        itemCode: "",
        itemName: "",
        buyerName: "",
        salesQuentity: "",
      });
      fetchSalesData(); // Re-fetch data after adding a new sales record
    } catch (error) {
      toast.error("Error adding sales record"); // Error notification
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/delete/${id}`);
      toast.success("Sales record deleted successfully!"); // Success notification
      fetchSalesData(); // Re-fetch data after deleting a sales record
    } catch (error) {
      toast.error("Error deleting sales record"); // Error notification
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "2px 2px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Create Sales Record</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={salesData.date ? salesData.date.split("T")[0] : ""} onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Item Code:</label>
        <select name="itemCode" value={salesData.itemCode} onChange={handleChange} style={{ width: "100%", padding: "8px", margin: "5px 0" }}>
          <option value="">Select Item Code</option>
          {items.map((item) => (
            <option key={item.itemId} value={item.itemId}>
              {item.itemId}
            </option>
          ))}
        </select>

        <label>Item Name:</label>
        <input type="text" name="itemName" value={salesData.itemName} readOnly style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Buyer Name:</label>
        <input type="text" name="buyerName" value={salesData.buyerName} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Sales Quantity:</label>
        <input type="number" name="salesQuentity" value={salesData.salesQuentity} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" }}>Submit</button>
      </form>

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Sales Records (Today)</h2>

      {/* Search Section */}
      <div style={{ marginBottom: "20px" }}>
        <select onChange={handleSearchColumnChange} style={{ padding: "8px", marginRight: "10px" }}>
          <option value="itemCode">Item Code</option>
          <option value="itemName">Item Name</option>
          <option value="buyerName">Buyer Name</option>
          <option value="salesQuentity">Sales Quantity</option>
        </select>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={handleSearchChange} 
          placeholder="Search..." 
          style={{ padding: "8px", marginRight: "10px" }} 
        />
        <button onClick={handleSearch} style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Search
        </button>
      </div>

      {/* Sales Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item Code</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Item Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Buyer Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salesList.map((sale) => (
            <tr key={sale._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sale.date}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sale.itemCode}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sale.itemName}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sale.buyerName}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{sale.salesQuentity}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button onClick={() => handleDelete(sale._id)} style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Delete</button>
                <button onClick={() => navigate(`/create-sales/update/${sale._id}`)} style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Toaster /> {/* Add Toaster component to display the toast messages */}
    </div>
  );
};

export default SalesCreate;
