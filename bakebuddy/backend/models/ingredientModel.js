// import mongoose from 'mongoose';

// const DailyConsumptionSchema = new mongoose.Schema({
//   unitType: { type: String, enum: ['pieces', 'kg', 'liter'] },
//   quantity: { type: Number, required: true },
//   date: { type: Date, default: Date.now }
// });

// const IngredientSchema = new mongoose.Schema({
//   ingredientId: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   maxUnits: { type: Number, required: true },
//   minUnits: { type: Number, required: true },
//   // Store multiple daily consumption records:
//   dailyConsumptions: [DailyConsumptionSchema]
// });

// export default mongoose.model('Ingredient', IngredientSchema);


import mongoose from 'mongoose';


const IngredientSchema = new mongoose.Schema({
  ingredientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  maxUnits: { type: Number, required: true },
  minUnits: { type: Number, required: true },
  unitsType: { type: String, enum: ['pieces', 'kg', 'liter'] },
  ingredientQuantity: { type: Number, required: true }
  // Store multiple daily consumption records:
  
});

export default mongoose.model('Ingredient', IngredientSchema);