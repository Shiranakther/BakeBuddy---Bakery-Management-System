import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // For table formatting in PDF
import "../../css/IngredientReport.css"; // Import the new CSS file

const IngredientReport = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ingredients", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIngredients(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Ingredient Report", 20, 10);

    // Define table columns and rows
    const tableColumn = ["ID", "Name", "Max Units", "Min Units", "Quantity", "Units Type"];
    const tableRows = ingredients.map(ingredient => [
      ingredient.ingredientId,
      ingredient.name,
      ingredient.maxUnits,
      ingredient.minUnits,
      ingredient.ingredientQuantity,
      ingredient.unitsType,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("ingredient_report.pdf"); // Download the PDF
  };

  const handleBack = () => {
    navigate('/show-ingredient'); // Navigate back to ShowIngredient
  };

  if (loading) return <p>Loading ingredients...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
     <div className="page-header">
                       <div className="page-header-image">
                         {/* <img src={productionHeader} alt="dashboard-page-header" className='page-header-icon' /> */}
                       </div>
                       <div className="page-header-title">Ingredient</div>
                     </div>
      <div className="ingredient-report-page-header">
        <div className="ingredient-report-page-header-title">Ingredient Report</div>
      </div>
      <div className="ingredient-report-container">
        <table className="ingredient-report-table">
          <thead className="ingredient-report-thead">
            <tr>
              <th className="ingredient-report-th">ID</th>
              <th className="ingredient-report-th">Name</th>
              <th className="ingredient-report-th">Max Units</th>
              <th className="ingredient-report-th">Min Units</th>
              <th className="ingredient-report-th">Quantity</th>
              <th className="ingredient-report-th">Units Type</th>
            </tr>
          </thead>
          <tbody className="ingredient-report-tbody">
            {ingredients.map((ingredient) => (
              <tr key={ingredient._id}>
                <td className="ingredient-report-td">{ingredient.ingredientId}</td>
                <td className="ingredient-report-td">{ingredient.name}</td>
                <td className="ingredient-report-td">{ingredient.maxUnits}</td>
                <td className="ingredient-report-td">{ingredient.minUnits}</td>
                <td className="ingredient-report-td">{ingredient.ingredientQuantity}</td>
                <td className="ingredient-report-td">{ingredient.unitsType}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ingredient-report-button-container">
          <button className="ingredient-report-download-pdf-button" onClick={downloadPDF}>
            Download PDF
          </button>
          <button className="ingredient-report-back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default IngredientReport;