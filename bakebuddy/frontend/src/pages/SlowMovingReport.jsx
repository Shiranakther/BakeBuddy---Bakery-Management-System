

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import '../../css/smartbake/slowmoving.css';
import productionHeader from "../../images/production-page-header-image.png";
import { useNavigate } from 'react-router-dom';


const SlowMovingReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomSearch, setIsCustomSearch] = useState(false);  // New state for custom date search
  const navigate = useNavigate();

  

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view`);
      setSalesData(response.data);
      setFilteredSales(response.data);
    } catch (error) {
      toast.error("Error fetching sales data");
    }
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const filtered = salesData.filter((sale) => {
      const saleDate = new Date(sale.date).toISOString().split("T")[0];
      return saleDate >= startDate && saleDate <= endDate;
    });

    const groupedSales = filtered.reduce((acc, sale) => {
        if (!acc[sale.itemCode]) {
          acc[sale.itemCode] = {
            itemCode: sale.itemCode,
            itemName: sale.itemName,
            buyerName: sale.buyerName,
            salesQuentity: 0,
            _id: sale._id, // Preserve _id
          };
        }
      
        // Group by itemCode and sum salesQuentity
        acc[sale.itemCode].salesQuentity += Number(sale.salesQuentity);
        return acc;
      }, {});

    setFilteredSales(Object.values(groupedSales));
    setIsCustomSearch(true);  // Mark that the search is custom
  };

  

  const handleClearSearch = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSales(salesData);
    setIsCustomSearch(false);  // Reset custom search flag
  };

 
  
  
    

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img
            src={productionHeader}
            alt="dashboard-page-header"
            className="page-header-icon"
          />
        </div>
        <div className="page-header-title">Production</div>
      </div>

      <div className="slowmoving-report-main-container">
        <div className="slowmoving-report-title">Smart Rebake &gt; Slow Moving Items</div>
        <div className="slowmoving-report-search-container">
          <label className="slowmoving-report-label">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="slowmoving-report-input"
          />
          <label className="slowmoving-report-label">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="slowmoving-report-input"
          />
          <button onClick={handleSearch} className="slowmoving-report-search-btn">
            Search
          </button>
          <button onClick={handleClearSearch} className="slowmoving-report-clear-btn">
            Clear Search
          </button>
        </div>

        <table className="slowmoving-report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Buyer Name</th>
              <th>Quantity</th>
              <th>Recipe Rebake</th>
            </tr>
          </thead>
          <tbody>
  {filteredSales.map((sale, index) => (
    <tr key={`${sale.itemCode}-${sale.buyerName}-${index}`}>
      <td>{isCustomSearch ? "custom" : new Date(sale.date).toLocaleDateString()}</td>
      <td>{sale.itemCode}</td>
      <td>{sale.itemName}</td>
      <td>{sale.buyerName}</td>
      <td>{sale.salesQuentity}</td>
      <td>
        <div className="smart-rebake-wrapper">
        <button onClick={() => navigate(`/smartbake/${sale.itemCode}`)} className="rebake-button">Rebake
            
        </button>
        </div>
       
      </td>
    </tr>
  ))}
</tbody>

        </table>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
            success: {
              style: { background: "#4CAF50" },
            },
            error: {
              style: { background: "#f44336" },
            },
          }}
        />
      </div>
    </>
  );
};

export default SlowMovingReport;
