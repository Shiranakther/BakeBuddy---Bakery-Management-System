import Ingredient from '../models/ingredientModel.js';

async function generateIngredientId() {
  let count = await Ingredient.countDocuments({});
  let newId;
  let isUnique = false;
  
  do {
    count++;
    newId = `ING-${count.toString().padStart(3, '0')}`;
    const existing = await Ingredient.findOne({ ingredientId: newId });
    isUnique = !existing;
  } while (!isUnique);
  
  return newId;
}

// Updated addIngredient
export async function addIngredient(req, res) {
  try {
    const { name, maxUnits, minUnits, unitsType } = req.body;
    if (!name || maxUnits == null || minUnits == null) {
      return res.status(400).json({ error: 'Please provide name, maxUnits, and minUnits' });
    }
    
    const ingredientId = await generateIngredientId();
    const newIngredient = new Ingredient({ 
      ingredientId, 
      name, 
      maxUnits, 
      minUnits, 
      unitsType 
    });
    await newIngredient.save();
    res.json(newIngredient);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error specifically
      res.status(409).json({ error: 'Duplicate ingredient ID generated, please try again' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

// Get all ingredients
export async function getIngredients(req, res) {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get ingredient by ID
export async function getIngredientById(req, res) {
  try {
    const ingredient = await Ingredient.findById(req.params.id );
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



// Update ingredient details
export async function updateIngredient(req, res) {
  try {
    const ingredient = await Ingredient.findById( req.params.id );
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    const { name, maxUnits, minUnits, ingredientQuantity , unitsType } = req.body;
    if (name) ingredient.name = name;
    if (maxUnits != null) ingredient.maxUnits = maxUnits;
    if (minUnits != null) ingredient.minUnits = minUnits;
    if (unitsType) ingredient.unitsType = unitsType;
    if (ingredientQuantity != null) ingredient.ingredientQuantity = ingredientQuantity;

    await ingredient.save();
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete ingredient
// Delete ingredient
export async function deleteIngredient(req, res) {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    // Delete the ingredient by its ID
    await Ingredient.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}





