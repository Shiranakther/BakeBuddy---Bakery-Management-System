import React, { useState, useEffect } from "react";
import '../css/statusinfo.css'
import productionHeader from "../images/production.png";
import Sales from "../images/sales.png";
import ingredient from "../images/ingredient.png";
import Item from "../images/item.png"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";


export default function StatusInfo() {
  const [totalProduction, setTotalProduction] = useState(0);
  const [productions, setProductions] = useState([]);
  const [todaySales, setTodaySales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[ingredients, setIngredients] = useState([]);
  const [ingredientCount, setIngredientCount] = useState(0);
    const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemCount, setItemCount] = useState(0); // Item count state
  useEffect(() => {
    fetchProductions();
    fetchSalesData();
    
  }, []);
 

  // Function to fetch productions from the API
  const fetchProductions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/production`);
      setProductions(response.data);
      calculateTotalProductionToday(response.data);
    } catch (error) {
      console.error("Error fetching productions:", error);
      toast.error("Failed to load production data.");
    }
  };

  // Function to calculate total production for today
  const calculateTotalProductionToday = (productions) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const todayProductions = productions.filter(
      (prod) => prod.date && prod.date.split("T")[0] === today
    );
    const total = todayProductions.reduce((acc, prod) => acc + Number(prod.quantity), 0);
    setTotalProduction(total);
  };


  const fetchSalesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales/view`);

      // Fixing right here: Convert quantity to Number immediately
      const cleanedData = response.data.map((sale) => ({
        ...sale,
        salesQuentity: Number(sale.salesQuentity) || 0,
      }));

      const totalSalesToday = getTodaySales(cleanedData);

      setTodaySales(totalSalesToday);
    } catch (error) {
      console.error(error);
      setError("Error fetching sales data");
      toast.error("Error fetching sales data");
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate today's total sales quantity
  const getTodaySales = (salesData) => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    // Filter sales that occurred today
    const todaySales = salesData.filter((sale) => {
      const saleDate = new Date(sale.date).toISOString().split('T')[0]; // Format sale date to 'YYYY-MM-DD'
      return saleDate === today;
    });

    // Return total sales quantity for today
    return todaySales.reduce((total, sale) => total + sale.salesQuentity, 0);
  };

   const fetchIngredients = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ingredients`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const fetchedIngredients = response.data || [];
    setIngredients(fetchedIngredients);
    setIngredientCount(fetchedIngredients.length);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching items from /api/item/all');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/all`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
        },
      });

      console.log('Fetched data:', response.data);

      const items = response.data || [];
      setItems(items);
      setDisplayedItems(items);
      setItemCount(items.length); // Store the count here
      setLoading(false);

    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err.response
        ? `Failed to fetch items: ${err.response.status} ${err.response.statusText} - ${err.response.data.message}`
        : err.message;
      setError(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }
, []);


  if (loading) {
    return <div className="loading-bar">Loading Sales Data ...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className='status-container'>

      <div className="status-container-wrapper">
        <div className="status-container-wrapper-name">
            <div className="status-container-wrapper-name-title">
            {totalProduction} <span className='status-container-wrapper-name-title-span'>Units</span>
            </div>
            <div className="status-container-wrapper-name-quantity" style={{ color: '#6FD54B'}}>
                Daily production
            </div>
        </div>
        <div className="status-container-wrapper-image" style={{ backgroundColor: '#6FD54B'}}>
            <img src={productionHeader}></img>
        </div>
      </div>

      <div className="status-container-wrapper">
        <div className="status-container-wrapper-name">
            <div className="status-container-wrapper-name-title">
                {todaySales} <span className='status-container-wrapper-name-title-span'>Units</span>
            </div>
            <div className="status-container-wrapper-name-quantity">
                Daily Sales
            </div>
        </div>
        <div className="status-container-wrapper-image">
            <img src={Sales}></img>
        </div>
      </div>

      <div className="status-container-wrapper">
        <div className="status-container-wrapper-name">
            <div className="status-container-wrapper-name-title">
            {ingredientCount} <span className='status-container-wrapper-name-title-span'>Units</span>
            </div>
            <div className="status-container-wrapper-name-quantity" style={{ color: '#e74c3c'}}>
                Total Ingredients
            </div>
        </div>
        <div className="status-container-wrapper-image"style={{ backgroundColor: '#e74c3c'}} >
            <img src={ingredient}></img>
        </div>
      </div>

      <div className="status-container-wrapper">
        <div className="status-container-wrapper-name">
            <div className="status-container-wrapper-name-title">
            {itemCount} <span className='status-container-wrapper-name-title-span'>Units</span>
            </div>
            <div className="status-container-wrapper-name-quantity"  style={{ color: '#2c3e50'}}>
                Total Items
            </div>
        </div>
        <div className="status-container-wrapper-image" style={{ backgroundColor: '#2c3e50'}}>
            <img src={Item}></img>
        </div>
      </div>

      
      


    </div>
  )
}
