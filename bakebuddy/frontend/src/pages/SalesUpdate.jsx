import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SalesUpdate = () => {
  const [salesData, setSalesData] = useState({
    date: "",
    itemCode: "",
    itemName: "",
    buyerName: "",
    salesQuentity: "",
  });

  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sales/view/${id}`);
        if (response.data) {
          setSalesData({
            date: response.data.date || "",
            itemCode: response.data.itemCode || "",
            itemName: response.data.itemName || "",
            buyerName: response.data.buyerName || "",
            salesQuentity: response.data.salesQuentity || "",
          });
        }
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    };
    fetchSalesData();
  }, [id]);

  const handleChange = (e) => {
    setSalesData({ ...salesData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/sales/update/${id}`, {
        date: salesData.date,
        buyerName: salesData.buyerName,
        salesQuentity: salesData.salesQuentity,
      });
      setMessage("Sales record updated successfully!");
      setTimeout(() => navigate("/create-sales"), 2000);
    } catch (error) {
      setMessage("Error updating sales record");
      console.error("Update error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "2px 2px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Update Sales Record</h2>
      {message && <p style={{ color: message.includes("Error") ? "red" : "green", textAlign: "center" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={salesData.date ? salesData.date.split("T")[0] : ""} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Item Code:</label>
        <input type="text" name="itemCode" value={salesData.itemCode} readOnly style={{ width: "100%", padding: "8px", margin: "5px 0", backgroundColor: "#f9f9f9" }} />

        <label>Item Name:</label>
        <input type="text" name="itemName" value={salesData.itemName} readOnly style={{ width: "100%", padding: "8px", margin: "5px 0", backgroundColor: "#f9f9f9" }} />

        <label>Buyer Name:</label>
        <input type="text" name="buyerName" value={salesData.buyerName} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <label>Sales Quantity:</label>
        <input type="number" name="salesQuentity" value={salesData.salesQuentity} onChange={handleChange} required style={{ width: "100%", padding: "8px", margin: "5px 0" }} />

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" }}>Update</button>
        
        <button type="button" onClick={() => navigate("/create-sales")} style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", marginTop: "10px", cursor: "pointer" }}>Back</button>
      </form>
    </div>
  );
};

export default SalesUpdate;
