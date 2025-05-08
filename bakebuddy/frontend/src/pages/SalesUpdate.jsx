import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../../css/sales/SalesUpdate.css"; // Keep existing CSS import
import salesHeader from "../../images/sales-page-header-image.png";

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view/${id}`);
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
        toast.error("Failed to fetch sales data");
      }
    };
    fetchSalesData();
  }, [id]);

  const handleChange = (e) => {
    setSalesData({ ...salesData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Updating sales record..."); // Show loading toast
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/sales/update/${id}`, {
        date: salesData.date,
        buyerName: salesData.buyerName,
        salesQuentity: salesData.salesQuentity,
      });
      toast.success("Sales record updated successfully!", {
        id: loadingToast, // Replace loading toast with success
        duration: 2000,
      });
      setTimeout(() => navigate("/create-sales"), 2000); // Navigate after toast
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating sales record", {
        id: loadingToast, // Replace loading toast with error
      });
      console.error("Update error:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
    <div className="page-header">
            <div className="page-header-image">
              <img src={salesHeader} alt="dashboard-page-header" className='page-header-icon' />
            </div>
            <div className="page-header-title">Sales</div>
          </div>
    <div className="sales-update-main-container">
      <h2 className="sales-update-title">Update Sales Record</h2>
      {message && <p className={`sales-update-message ${message.includes("Error") ? "sales-update-error" : "sales-update-success"}`}>{message}</p>}
      <form className="sales-update-form" onSubmit={handleSubmit}>
        <label className="sales-update-label">Date:</label>
        <input
          type="date"
          name="date"
          value={salesData.date ? salesData.date.split("T")[0] : ""}
          onChange={handleChange}
          required
          className="sales-update-input"
        />

        <label className="sales-update-label">Item Code:</label>
        <input
          type="text"
          name="itemCode"
          value={salesData.itemCode}
          readOnly
          className="sales-update-input sales-update-readonly"
        />

        <label className="sales-update-label">Item Name:</label>
        <input
          type="text"
          name="itemName"
          value={salesData.itemName}
          readOnly
          className="sales-update-input sales-update-readonly"
        />

        <label className="sales-update-label">Buyer Name:</label>
        <input
          type="text"
          name="buyerName"
          value={salesData.buyerName}
          onChange={handleChange}
          required
          className="sales-update-input"
        />

        <label className="sales-update-label">Sales Quantity:</label>
        <input
          type="number"
          name="salesQuentity"
          value={salesData.salesQuentity}
          onChange={handleChange}
          required
          className="sales-update-input"
        />

        <div className="sales-update-button-group">
          <button type="submit" className="sales-update-submit-btn">Update</button>
          <button type="button" onClick={() => navigate("/create-sales")} className="sales-update-back-btn">Back</button>
        </div>
      </form>

      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 1000, // Default duration
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#4CAF50",
            },
          },
          error: {
            style: {
              background: "#f44336",
            },
          },
        }}
      />
    </div>
  </>
  );
};

export default SalesUpdate;