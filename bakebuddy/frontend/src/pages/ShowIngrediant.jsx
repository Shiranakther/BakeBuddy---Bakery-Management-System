


import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/production.css';

const ShowIngredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ingredients"); // Use full URL
        const data = Array.isArray(response.data) ? response.data : []; // Ensure response is an array
        setIngredients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);




//    const handleDelete = async (id) => {
//       try {
//         await axios.delete(`http://localhost:5000/api/sales/delete/${id}`);
//         toast.success("Sales record deleted successfully!"); // Success notification
//         fetchSalesData(); // Re-fetch data after deleting a sales record
//       } catch (error) {
//         toast.error("Error deleting sales record"); // Error notification
//       }
//     };



const deleteIngredient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`); // Use correct endpoint
      toast.success("Ingredient deleted successfully!"); // Success notification
      fetchIngredients(); // Re-fetch data after deletion
    } catch (error) {
      toast.error("Error deleting ingredient"); // Error notification
    }
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ingredient List</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Max Units</th>
            <th className="border px-4 py-2">Min Units</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Units Type</th>
            <th className="border px-4 py-2">Update or Delete</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient._id} className="border">
              <td className="border px-4 py-2">{ingredient.ingredientId}</td>
              <td className="border px-4 py-2">{ingredient.name}</td>
              <td className="border px-4 py-2">{ingredient.maxUnits}</td>
              <td className="border px-4 py-2">{ingredient.minUnits}</td>
              <td className="border px-4 py-2">{ingredient.ingredientQuantity}</td>
              <td className="border px-4 py-2">{ingredient.unitsType}</td>
              <td className="border px-4 py-2"> <button className="delete-btn1" onClick={() => deleteIngredient(sale._id)}>Delete</button>
              <button className="delete-btn2" onClick={() => navigate(`/create-sales/update/${sale._id}`)}>Update</button></td>

             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowIngredient;
