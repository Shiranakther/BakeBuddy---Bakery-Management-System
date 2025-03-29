

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import '../../css/smartbake/smartbake.css';
import { jsPDF } from "jspdf"; 
import productionHeader from "../../images/production-page-header-image.png";


const Smartbake = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(null);

  const { id } = useParams();
  const newid = id;
  const [imageUrl, setImageUrl] = useState("");


  useEffect(() => {
    const getItemIngredients = async () => {
      try {
        // Fetch all items
        const response = await axios.get("http://localhost:5000/api/item/all");
        console.log(response.data);
        if (!response.data) {
          console.log("No items found");
          return;
        }

        // Find the specific item by its ID
        const selectedItem = response.data.find(item => item.itemId === id);

        if (!selectedItem) {
          console.log("Item not found");
          return;
        }

        setItem(selectedItem); // Set the selected item to the state
        setIngredients(selectedItem.ingredients.map(ingredient => ingredient.name).join(", ")); // Set ingredients for the recipe search

      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    getItemIngredients(); // Fetch the data when the component mounts
  }, [id]);

  

  const fetchRecipes = async () => {
    if (!ingredients.trim()) return alert("No ingredients found!");

    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD-G_52yfOM0F-y01BcNdTjAGvsRewtL1o`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful recipe assistant. Generate 9  bakery or pastry recipes with highly decriptive instructions  based on user ingredients: ${ingredients}.
                    Format your response as JSON with an array of objects,try to use minimal extra ingridients ,and in instructions display number items that can make , each containing "title", "ingredients" (array), and "instructions" (string).
                    Example format: [{"title": "Cake", "ingredients": ["flour", "sugar"], "instructions": "Mix and bake."}]`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawResponse = await response.text();
      console.log("Raw AI response:", rawResponse);

      try {
        const data = JSON.parse(rawResponse);

        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = responseText.match(/```json([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          const recipesData = JSON.parse(jsonMatch[1]);
          if (Array.isArray(recipesData)) {
            setRecipes(recipesData);
          } else {
            throw new Error("AI response format incorrect.");
          }
        } else {
          throw new Error("AI response does not contain valid JSON.");
        }
      } catch (jsonError) {
        console.error("Error parsing raw response:", jsonError);
        alert("Failed to parse AI response.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

 
  

  const renderInstructions = (instructions) => {
    const steps = instructions.split("\n").filter(step => step.trim());
  
    return (
      <ul className="smartbake-instructions-list">
        {steps.map((step, index) => {
          // Remove the number prefix from the instruction step
          const stepWithoutNumber = step.replace(/^\d+\.\s*/, "");
  
          return (
            <li key={index} className="smartbake-instruction-step">
              <span className="smartbake-step-number">Step {index + 1}: </span>
              <span>{stepWithoutNumber}</span>
            </li>
          );
        })}
      </ul>
    );
  };
  

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Page settings
    const margin = 20;
    const lineHeight = 8; // Smaller line height
    const pageHeight = doc.internal.pageSize.height;
    let currentY = margin;

    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text("Contact: info@bakery.com | +123 456 789", 14, 28);
  

    currentY += lineHeight + 15;

    // Title section with item name in color #d9534f (centered)
    doc.setFontSize(14); // Font size for title
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 83, 79); // Set color to #d9534f (RGB)
    const titleWidth = doc.getTextWidth(selectedRecipe.title);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2; // Center the title
    doc.text(selectedRecipe.title, titleX, currentY);
    currentY += lineHeight + 8; // Adjust spacing after title
  
    // Ingredients section (bold title)
    doc.setFontSize(12); // Font size for ingredients
    doc.setFont("helvetica", "bold"); // Bold font for the title
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.text("Ingredients:", margin, currentY);
    currentY += lineHeight+3;
  
    doc.setFontSize(10); // Font size for ingredient list
    doc.setFont("helvetica", "normal"); // Normal font for ingredients
    selectedRecipe.ingredients.forEach((ingredient, index) => {
      doc.text(`- ${ingredient}`, margin, currentY);
      currentY += lineHeight;
    });

    currentY += lineHeight+3;
  
    // Instructions section (bold title)
    doc.setFontSize(12); // Font size for instructions title
    doc.setFont("helvetica", "bold"); // Bold font for instructions title
    doc.setTextColor(0, 0, 0); // Reset color to black
    doc.text("Instructions:", margin, currentY);
    currentY += lineHeight+3;
  
    doc.setFontSize(10); // Font size for ingredient list
    doc.setFont("helvetica", "normal"); // Normal font for ingredients
    // Instructions text (normal font)
    const instructions = selectedRecipe.instructions.split("\n").filter(step => step.trim());
  
    instructions.forEach((step, index) => {
      // Remove "Step X: " by splitting the string and using only the part after "Step X: "
      const stepText = step.replace(/^Step \d+: /, 'Step: ');
  
      // Set text color for the instruction steps (black color)
      doc.setTextColor(0, 0, 0); // Black color for instructions
  
      // Wrap text to fit within page width
      const wrappedText = doc.splitTextToSize(stepText, 180); // 180 is the width for wrapping text
  
      // Check if text exceeds page height, and add a new page if necessary
      if (currentY + (wrappedText.length * lineHeight) > pageHeight - margin) {
        doc.addPage(); // Add new page
        currentY = margin; // Reset Y position
      }
  
      // Add wrapped text with adjusted line height
      wrappedText.forEach((line, i) => {
        doc.text(line, margin, currentY + (i * lineHeight));
      });
  
      currentY += wrappedText.length * lineHeight; // Adjust current Y based on wrapped lines
    });
  
    
    // Save PDF with title as filename
    doc.save(`${selectedRecipe.title}.pdf`);
  };
  
  const fetchImageUrl = async (recipeTitle) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            query: recipeTitle,
            apiKey: "e113f012de78493f9598e9d9889b7eed",
          },
        }
      );
      const imageUrl = response.data.results[0]?.image;
      setImageUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    if (selectedRecipe) {
      fetchImageUrl(selectedRecipe.title); // Fetch image when recipe is selected
    }
  }, [selectedRecipe]);
  
  
  
  
  

  useEffect(() => {
    if (item) {
      fetchRecipes(); // Automatically fetch recipes once item data is available
    }
  }, [item]); // Trigger when item state changes

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

          <div className="smartbake-container">
          <h2 className="smartbake-report-title">
  Smart Rebake &gt; Recipes &gt; <span style={{ color: "#FF6F00" }}>{id}</span>
</h2>
      {item ? (
         <div className="smartbake-detail-wrapper">
         <div className="smartbake-item-name">{item.name}</div>
         <div className="smartbake-item-details">
         
          
          <div className="smartbake-ingredients-details">
          <div className="smartbake-ingredients-header">Ingredients</div>
          <div className="smartbake-ingredients-table">
  <table>
    <thead>
      <tr>
        <th>Ingredient</th>
        <th>Volume</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>
      {item.ingredients.map((ingredient, index) => (
        <tr key={index}>
          <td>{ingredient.name}</td>
          <td>{ingredient.volume}</td>
          <td>{ingredient.unit}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </div>
          <div className="smartbake-items-image">
          {imageUrl ? (
    <img src={imageUrl} alt={selectedRecipe?.title} className="recipe-image" />
  ) : (
    <p>No image available</p>
  )}
          </div>
          
        </div>
         </div>
        
      ) : (
        <p className="loading-text">Loading item details...</p>
      )}

      <div className="recipe-suggestions">
        <h2>Suggested Bakery & Pastry Recipes</h2>
        
        

        {loading ? <p>Loading recipes...</p> : (
          <div className="recipe-card-wrapper">
            {recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                <h4 className="recipe-title">{recipe.title}</h4>
                <button onClick={() => setSelectedRecipe(recipe)} className="view-recipe-button">View Recipe</button>
              </div>
            ))}
          </div>
        )}

        {selectedRecipe && (
          <div className="recipe-details">
            <h3 className="recipe-title-main">{selectedRecipe.title}</h3>
            <h4 className="bakebyddy-recipe-main-titles">Ingredients:</h4>
            {/* <ul className="recipe-ingredients">
              {selectedRecipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul> */}
            <div className="recipe-ingredients-table">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Ingredient</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecipe.ingredients.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div className="bakebyddy-recipe-main-titles" >Instructions</div>
            {renderInstructions(selectedRecipe.instructions)}

            <button
              onClick={() => setSelectedRecipe(null)}
              className="close-recipe-button"
            >
              Close
            </button>
            <button
              onClick={generatePDF}
              className="download-pdf-button"
              style={{
                marginTop: "15px",
                padding: "8px 12px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
    
    </>
   
  );
};

export default Smartbake;



