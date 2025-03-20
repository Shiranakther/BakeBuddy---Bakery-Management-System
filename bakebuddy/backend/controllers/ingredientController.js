import Ingredient from '../models/ingredientModel.js';

async function generateIngredientId() {
  const count = await Ingredient.countDocuments({});
  return `ING-${(count + 1).toString().padStart(3, '0')}`;
}

export async function addIngredient(req, res) {
  try {
    const { name, maxUnits, minUnits } = req.body;
    if (!name || maxUnits == null || minUnits == null) {
      return res.status(400).json({ error: 'Please provide name, maxUnits, and minUnits' });
    }
    const ingredientId = await generateIngredientId();
    const newIngredient = new Ingredient({ ingredientId, name, maxUnits, minUnits });
    await newIngredient.save();
    res.json(newIngredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getIngredients(req, res) {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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

export async function updateDailyConsumption(req, res) {
  try {
    const ingredient = await Ingredient.findOne({ ingredientId: req.params.id });
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    const { unitType, quantity } = req.body;
    const allowedUnits = ['pieces', 'kg', 'liter'];
    if (!allowedUnits.includes(unitType)) {
      return res.status(400).json({ error: 'Invalid unit type. Allowed values: pieces, kg, liter' });
    }

    // Check that the individual quantity is within the allowed range.
    if (quantity < ingredient.minUnits || quantity > ingredient.maxUnits) {
      return res.status(400).json({ error: `Quantity must be between ${ingredient.minUnits} and ${ingredient.maxUnits}` });
    }

    // Determine the start and end of today.
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Calculate total consumption for today.
    const todaysConsumptions = ingredient.dailyConsumptions.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= startOfToday && recordDate < endOfToday;
    });

    const totalToday = todaysConsumptions.reduce((sum, record) => sum + record.quantity, 0);

    // Check if adding the new quantity would exceed the maximum available units.
    if (totalToday + quantity > ingredient.maxUnits) {
      return res.status(400).json({ error: 'Insufficient ingredients' });
    }

    // If all validations pass, record the new daily consumption.
    ingredient.dailyConsumptions.push({ unitType, quantity, date: new Date() });
    await ingredient.save();

    res.json({ message: 'Daily consumption recorded', ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
}

export async function updateIngredient(req, res) {
  try {
    const ingredient = await Ingredient.findById(req.params.id );
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    const { name, maxUnits, minUnits } = req.body;
    if (name) ingredient.name = name;
    if (maxUnits != null) ingredient.maxUnits = maxUnits;
    if (minUnits != null) ingredient.minUnits = minUnits;

    await ingredient.save();
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteIngredient(req, res) {
  try {
    const ingredient = await Ingredient.findById(req.params.id );
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    // Use deleteOne() instead of remove()
    await Ingredient.deleteOne();

    res.json({ message: 'Ingredient removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getIngredientUsageByIdAndDateRange(req, res) {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Please provide startDate and endDate as query parameters in YYYY-MM-DD format' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set end to end of day
    end.setHours(23, 59, 59, 999);

    const ingredient = await Ingredient.findOne({ ingredientId: id });
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    // Filter daily consumptions that fall within the date range
    const consumptionsInRange = ingredient.dailyConsumptions.filter(record => {
      const consumptionDate = new Date(record.date);
      return consumptionDate >= start && consumptionDate <= end;
    });
    
    // Sum up the consumption quantity
    const totalUsed = consumptionsInRange.reduce((sum, record) => sum + record.quantity, 0);
    // Calculate available units for that period
    const availableUnits = ingredient.maxUnits - totalUsed;

    res.json({
      ingredientId: ingredient.ingredientId,
      name: ingredient.name,
      maxUnits: ingredient.maxUnits,
      totalUsed,
      availableUnits,
      consumptions: consumptionsInRange
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}