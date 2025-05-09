import React, { useState, useEffect } from 'react';
import summary from "../../images/summary.png";
import "../../css/Home.css";
import dashboardPageHeader from "../../images/dashboard-page-header-image.png";
import axios from "axios";
import { Line } from "react-chartjs-2"; // 🧠 Changed from Bar to Line
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"; // 🧠 Updated here
import toast, { Toaster } from "react-hot-toast";
import StatusInfo from '../../components/StatusInfo';
// Register chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Home() {

  const [salesData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupedSales, setGroupedSales] = useState({});


  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view`);

      // Fixing right here: Convert quantity to Number immediately
      const cleanedData = response.data.map(sale => ({
        ...sale,
        salesQuentity: Number(sale.salesQuentity) || 0,
      }));

      setSalesData(cleanedData);
      setFilteredSales(cleanedData);
    } catch (error) {
      console.error(error);
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

    setFilteredSales(filtered);
  };

  const handleClearSearch = () => {
    setStartDate("");
    setEndDate("");
    setFilteredSales(salesData);
  };

  useEffect(() => {
    groupSalesByDate();
  }, [filteredSales]);

  const groupSalesByDate = () => {
    const grouped = {};

    filteredSales.forEach((sale) => {
      const date = new Date(sale.date).toISOString().split("T")[0];
      const quantity = sale.salesQuentity || 0;

      if (grouped[date]) {
        grouped[date] += quantity;
      } else {
        grouped[date] = quantity;
      }
    });

    setGroupedSales(grouped);
  };




  const chartData = {
    labels: Object.keys(groupedSales),
    datasets: [
      {
        label: "Daily Sales Quantity",
        data: Object.values(groupedSales),
        backgroundColor: "#FFA925 ",
        borderColor: "#FFA725",
        pointBackgroundColor: "#FFA725", 
        pointBorderColor: "#fff",
        pointRadius: 5, // 🌟 Make the points visible
        pointHoverRadius: 7,
        tension: 0.2, // 🎯 Smooth curved lines
        fill: false, // 🧹 No fill under line
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sales Quantity",
        },
      },
    },
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-image">
          <img src={dashboardPageHeader} alt="dashboard-page-header" className='page-header-icon' />
        </div>
        <div className="page-header-title">Dashboard</div>
      </div>

      <StatusInfo />

      <div className="home-container">
        <div className="home-title">Sales Overview</div>

        <div className="home-filters">
          <div className="home-filter-start-date">
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="home-filter-end-date">
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="home-filter-controller">
          <button onClick={handleSearch} className='home-filter-controller-filter'>Filter</button>
          <button onClick={handleClearSearch} className='home-filter-controller-clear'>Clear</button>
          </div>
          
          
        </div>

        <div className="home-chart">
          {/* 🧠 Changed to Line chart here */}
          <Line data={chartData} options={chartOptions} />
        </div>

        <Toaster position="top-right" />
      </div>
    </>
  )
}
