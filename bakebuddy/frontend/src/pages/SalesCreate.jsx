import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import salesHeader from "../../images/sales-page-header-image.png";
import '../../css/sales/SalesCreate.css'; // Keep existing CSS import

const SalesCreate = () => {
  const [salesData, setSalesData] = useState({
    date: "",
    itemCode: "",
    itemName: "",
    buyerName: "",
    salesQuentity: "",
  });
  const [salesList, setSalesList] = useState([]);
  const [items, setItems] = useState([]);
  const [searchColumn, setSearchColumn] = useState("itemCode");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchSalesData();
    fetchItems();
    const interval = setInterval(fetchSalesData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredSales = response.data.filter(sale => {
        const saleDate = new Date(sale.date);
        saleDate.setHours(0, 0, 0, 0);
        return saleDate.getTime() === today.getTime();
      });

      setSalesList(filteredSales);
    } catch (error) {
      console.error("Error fetching sales data", error);
      toast.error("Failed to fetch sales data");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/all`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
      toast.error("Failed to fetch items");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSearch = () => {
    const filteredSales = salesList.filter((sale) => {
      return sale[searchColumn]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
    setSalesList(filteredSales);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchSalesData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "itemCode") {
      const selectedItem = items.find(item => item.itemId === value);
      if (selectedItem) {
        setSalesData(prevData => ({
          ...prevData,
          itemCode: value,
          itemName: selectedItem.name,
        }));
      } else {
        setSalesData(prevData => ({
          ...prevData,
          itemCode: value,
          itemName: "",
        }));
      }
    } else {
      setSalesData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding sales record..."); // Show loading toast
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/sales/create`, salesData);
      toast.success("Sales record added successfully!", {
        id: loadingToast, // Replace loading toast with success
        duration: 2000,
      });
      setSalesData({
        date: "",
        itemCode: "",
        itemName: "",
        buyerName: "",
        salesQuentity: "",
      });
      fetchSalesData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding sales record", {
        id: loadingToast, // Replace loading toast with error
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sales record?");
    if (!confirmDelete) return;

    const loadingToast = toast.loading("Deleting sales record..."); // Show loading toast
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/sales/delete/${id}`);
      toast.success("Sales record deleted successfully!", {
        id: loadingToast, // Replace loading toast with success
        duration: 2000,
      });
      fetchSalesData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting sales record", {
        id: loadingToast, // Replace loading toast with error
      });
    }
  };

  const formatDate = (isoDate) => {
    return isoDate ? isoDate.split('T')[0] : '';
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img src={salesHeader} alt="dashboard-page-header" className='page-header-icon' />
        </div>
        <div className="page-header-title">Sales</div>
      </div>

      <div className="sales-create-main-container">
        <h2 className="sales-create-title">Create Sales Record</h2>
        <form className="sales-create-form" onSubmit={handleSubmit}>
          <div className="sales-create-content-wrapper">
            <div className="sales-create-content">
              <label className="sales-create-label">Date:</label>
              <input 
                type="date" 
                name="date" 
                value={salesData.date ? salesData.date.split("T")[0] : ""} 
                onChange={handleChange} 
                className="sales-create-input"
              />

              <label className="sales-create-label">Item Code:</label>
              <select 
                name="itemCode" 
                value={salesData.itemCode} 
                onChange={handleChange} 
                className="sales-create-select"
              >
                <option value="">Select Item Code</option>
                {items.map((item) => (
                  <option key={item.itemId} value={item.itemId}>
                    {item.itemId}
                  </option>
                ))}
              </select>

              <label className="sales-create-label">Item Name:</label>
              <input 
                type="text" 
                name="itemName" 
                value={salesData.itemName} 
                readOnly 
                className="sales-create-input sales-create-readonly"
              />
            </div>
          </div>
          <div className="sales-create-content-wrapper">
            <div className="sales-create-content">
              <label className="sales-create-label">Buyer Name:</label>
              <input 
                type="text" 
                name="buyerName" 
                value={salesData.buyerName} 
                onChange={handleChange} 
                required 
                className="sales-create-input"
              />

              <label className="sales-create-label">Sales Quantity:</label>
              <input 
                type="number" 
                name="salesQuentity" 
                value={salesData.salesQuentity} 
                onChange={handleChange} 
                required 
                className="sales-create-input"
              />

              <button type="submit" className="sales-create-submit-btn">Submit</button>
            </div>
          </div>
        </form>

        <h2 className="sales-create-title">Sales Records (Today)</h2>

        <div className="sales-create-search-container">
          <select onChange={handleSearchColumnChange} className="sales-create-search-select">
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
            className="sales-create-search-input"
          />
          <button onClick={handleSearch} className="sales-create-search-btn">Search</button>
          <button onClick={handleClearSearch} className="sales-create-clear-btn">Clear Search</button>
        </div>

        <table className="sales-create-table">
          <thead>
            <tr className="sales-create-table-header">
              <th className="sales-create-table-th">Date</th>
              <th className="sales-create-table-th">Item Code</th>
              <th className="sales-create-table-th">Item Name</th>
              <th className="sales-create-table-th">Buyer Name</th>
              <th className="sales-create-table-th">Quantity</th>
              <th className="sales-create-table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salesList.map((sale) => (
              <tr key={sale._id} className="sales-create-table-row">
                <td className="sales-create-table-td">{formatDate(sale.date)}</td>
                <td className="sales-create-table-td">{sale.itemCode}</td>
                <td className="sales-create-table-td">{sale.itemName}</td>
                <td className="sales-create-table-td">{sale.buyerName}</td>
                <td className="sales-create-table-td">{sale.salesQuentity}</td>
                <td className="sales-create-table-td">
                  <button 
                    onClick={() => handleDelete(sale._id)} 
                    className="sales-create-delete-btn"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => navigate(`/create-sales/update/${sale._id}`)} 
                    className="sales-create-update-btn"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1000,
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

export default SalesCreate;