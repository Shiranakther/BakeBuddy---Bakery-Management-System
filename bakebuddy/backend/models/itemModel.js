
import mongoose from "mongoose";

/*const ingredientSchema = new mongoose.Schema({
  ingredientId: {
    type: String, // Manual string ID (e.g., "ing001")
    required: true, // Ensure it's provided in the request
  },
  name: String,
  quantity: String,
  unit: String,
});

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String, // Manual string ID (e.g., "item001")
    required: true, // Ensure it's provided in the request
  },
  name: String,
  price: Number,
  description: String,
  image: String,
  ingredients: [ingredientSchema], // Embedded ingredients with manual ingredientIds
});

const Item = mongoose.model('Item', itemSchema);

export default Item;*/


// item.model.js


const ingredientSchema = new mongoose.Schema({
  ingredientId: {
    type: String, // e.g., "ing001"
    required: true,
  },
  name: String,
  volume: Number, // Changed from float to Number
  unit: {
    type: String,
    enum: ['kg', 'l'], // Restrict to "kg" or "l"
    default: null, // Optional, can be omitted if not set
  },
});

const itemSchema = new mongoose.Schema({
  itemId: {
    type: String, // e.g., "item001", auto-generated
    unique: true, // Enforce uniqueness in MongoDB
  },
  name: String,
  Category: String, // Fixed typo from Catogory
  description: String,
  ingredients: [ingredientSchema],
});

const Item = mongoose.model('Item', itemSchema);

export default Item;