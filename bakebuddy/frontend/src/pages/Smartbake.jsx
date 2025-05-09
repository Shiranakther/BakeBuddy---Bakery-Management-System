

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/item/all`);
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

 
  

  // const renderInstructions = (instructions) => {
  //   const steps = instructions.split("\n").filter(step => step.trim());
  
  //   return (
  //     <ul className="smartbake-instructions-list">
  //       {steps.map((step, index) => {
  //         // Remove the number prefix from the instruction step
  //         const stepWithoutNumber = step.replace(/^\d+\.\s*/, "");
  
  //         return (
  //           <li key={index} className="smartbake-instruction-step">
  //             <span className="smartbake-step-number">Step {index + 1}: </span>
  //             <span>{stepWithoutNumber}</span>
  //           </li>
  //         );
  //       })}
  //     </ul>
  //   );
  // };

  const renderInstructions = (instructions) => {
    // Check if instructions contain newlines, otherwise split by ". " as a fallback
    const steps = instructions.includes("\n") 
      ? instructions.split("\n").filter(step => step.trim()) 
      : instructions.split(/\d+\.\s*/).filter(step => step.trim());
  
    return (
      <ul className="smartbake-instructions-list">
        {steps.map((step, index) => (
          <li key={index} className="smartbake-instruction-step">
            <span className="smartbake-step-number">Step {index + 1}: </span>
            <span>{step.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  

  

const generatePDF = () => {
    const doc = new jsPDF();

    const margin = 20;
    const lineHeight = 8;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = margin + 65; // Adjusted for header and title outside border

    // === Header Background ===
    doc.setFillColor(255, 245, 235); // Light orange (#FFF5EB)
    doc.rect(0, 0, pageWidth, 40, 'F'); // Background for header section

    // === Header ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30); // Big title
    const bakeryName = "Indika Bakers";
    doc.setTextColor(105,105,105); // Dark grey (#333)
    const nameWidth = doc.getTextWidth(bakeryName);
    doc.text(bakeryName, (pageWidth - nameWidth) / 2, margin);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const address = "NO 302, Kandy Rd, Malabe";
    const phone = "0754536524";

    const addressWidth = doc.getTextWidth(address);
    const phoneWidth = doc.getTextWidth(phone);

    doc.text(address, (pageWidth - addressWidth) / 2, margin + 7);
    doc.text(phone, (pageWidth - phoneWidth) / 2, margin + 13);

    // === Title ===
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(217, 83, 79); // #d9534f
    const titleWidth = doc.getTextWidth(selectedRecipe.title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(selectedRecipe.title, titleX, margin + 35);
    
    // === Border ===
    doc.setDrawColor(0);
    doc.rect(margin - 5, margin + 50, pageWidth - 2 * (margin - 5), pageHeight - margin * 2 - 45, 'S');

    // === Ingredients Section ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Ingredients:", margin, currentY);
    currentY += lineHeight + 3;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    selectedRecipe.ingredients.forEach((ingredient) => {
        doc.text(`- ${ingredient}`, margin, currentY);
        currentY += lineHeight;
    });

    currentY += lineHeight + 3;

    // === Instructions Section ===
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Instructions:", margin, currentY);
    currentY += lineHeight + 3;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    let instructions;
    if (selectedRecipe.instructions.includes("\n")) {
        instructions = selectedRecipe.instructions.split("\n").filter(step => step.trim());
    } else {
        instructions = selectedRecipe.instructions.split(/\d+\.\s*/).filter(step => step.trim());
    }

    instructions.forEach((step, index) => {
        const stepText = `Step ${index + 1}: ${step.trim()}`;
        const wrappedText = doc.splitTextToSize(stepText, 180);

        if (currentY + (wrappedText.length * lineHeight) > pageHeight - margin - 15) {
            addFooter(doc, pageHeight, margin);
            doc.addPage();
            addHeader(doc, pageWidth, margin);
            doc.rect(margin - 5, margin + 25, pageWidth - 2 * (margin - 5), pageHeight - margin * 2 - 10, 'S');
            currentY = margin + 30;
        }

        wrappedText.forEach((line, i) => {
            doc.text(line, margin, currentY + (i * lineHeight));
        });

        currentY += wrappedText.length * lineHeight;
    });

    // Final Footer
    addFooter(doc, pageHeight, margin);

    doc.save(`${selectedRecipe.title}.pdf`);
};

// Helper to add footer
const addFooter = (doc, pageHeight, margin) => {
    const now = new Date().toLocaleString();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(now, margin, pageHeight - 10);
    const rightsText = "All rights reserved BakeBuddy.";
    const rightsWidth = doc.getTextWidth(rightsText);
    const centerX = (doc.internal.pageSize.width - rightsWidth) / 2;
    doc.text(rightsText, centerX, pageHeight - 10);
};

// Optional: Add header again on new page
const addHeader = (doc, pageWidth, margin) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const headerText = [
        "Indika Bakers",
        "NO 302, Kandy Rd, Malabe",
        "Phone: 0754536524"
    ];
    headerText.forEach((line, i) => {
        const textWidth = doc.getTextWidth(line);
        doc.text(line, pageWidth - textWidth - margin, margin + (i * 6));
    });
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



