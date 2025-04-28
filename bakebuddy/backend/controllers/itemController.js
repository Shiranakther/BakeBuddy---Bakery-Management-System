

import Item from '../models/itemModel.js';
/*import Ingredient from '../models/ingredients.model.js';*/
import Ingredient from '../models/ingredientModel.js';
import Notification from '../models/notificationModel.js'; // Adjust the import path based on your file structure

/*export const create = async (req, res) => {
  try {
    // Create a new item instance from the request body
    const item = new Item(req.body);

    // Save the item to the database
    const savedItem = await item.save();

    // Respond with the created item and a 201 status (Created)
    res.status(201).json("item created succusfully");
  } catch (error) {
    // Handle errors (e.g., validation errors, database issues)
    res.status(400).json({ message: "Error creating item", error: error.message });
  }
};*/

// Helper function to generate and verify a unique itemId
async function generateUniqueItemId() {
  let nextNumber = 1;
  let itemId;
  let exists;

  // Find the last itemId to start from
  const lastItem = await Item.findOne()
    .sort({ itemId: -1 }) // Sort descending by itemId
    .exec();

  if (lastItem && lastItem.itemId) {
    const lastNumber = parseInt(lastItem.itemId.replace("item", ""), 10);
    nextNumber = lastNumber + 1;
  }

  // Loop until we find an unused itemId
  do {
    itemId = `item${String(nextNumber).padStart(3, "0")}`; // e.g., "item001"
    exists = await Item.exists({ itemId }); // Check if this itemId is already in use
    if (exists) {
      nextNumber++; // Increment if it exists
    }
  } while (exists);

  return itemId;
}

// Helper function to validate ingredientIds
async function validateIngredients(ingredients) {
  const ingredientIds = ingredients.map(ing => ing.ingredientId); // Extract ingredientIds
  const existingIngredients = await Ingredient.find({ ingredientId: { $in: ingredientIds } });
  
  // Check if all provided ingredientIds exist
  const existingIds = existingIngredients.map(ing => ing.ingredientId);
  const missingIds = ingredientIds.filter(id => !existingIds.includes(id));

  return {
    isValid: missingIds.length === 0,
    missingIds,
  };
}





export const create = async (req, res) => {
  try {
    // Check if an item with the same name already exists
    const existingItem = await Item.findOne({ name: req.body.name });
    if (existingItem) {
      return res.status(409).json({ 
        message: "Item with this name already exists", 
        itemId: existingItem.itemId
      });
    }

      // Validate ingredients if provided
      if (req.body.ingredients && req.body.ingredients.length > 0) {
        const validation = await validateIngredients(req.body.ingredients);
        if (!validation.isValid) {
          return res.status(400).json({ 
            message: "Some ingredients do not exist in the database", 
            missingIngredientIds: validation.missingIds 
          });
        }
      }
  

    // Generate a unique itemId
    const itemId = await generateUniqueItemId();

    // Create the new item with the generated itemId and request body
    const itemData = {
      ...req.body, // Spread the request body (name, price, etc.)
      itemId,      // Add the generated itemId
    };
    const item = new Item(itemData);

    // Save to the database
    const savedItem = await item.save();

    // Respond with the created item
    const notification = await Notification.create({
      title: `New Item Created: ${itemId}`,
      message: `A new item named "${req.body.name}" has been created.`,
      type: 'Items', // Set the type as 'Production'
      isRead: false,
      metadata: { },
  });
  res.status(201).json({ item, notification, msg: 'item created and notification sent.' });

  } catch (error) {
    res.status(400).json({ message: "Error creating item", error: error.message });
  }
};

// Add this new function
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from the database
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findOneAndDelete({ itemId });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const notification = await Notification.create({
      title: `Item Deleted: ${itemId}`,
      message: `The item with ID: ${itemId} has been deleted.`,
      type: 'Items',
      isRead: false,
      metadata: { itemId },  // You can add more metadata if needed
    });
    res.status(200).json({ message: "Item deleted successfully", itemId });
  } catch (error) {
    res.status(500).json({ message: "Er    ror deleting item", error: error.message });
  }
};


export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Gather the update data from the request body
    const updateData = {
      name: req.body.name,
      Category: req.body.Category,
      description: req.body.description,
      ingredients: req.body.ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        name: ing.name,
        volume: parseFloat(ing.volume),
        unit: ing.unit,
      })),
    };

    // Check if an item with the same name already exists, excluding the current item
    const existingItem = await Item.findOne({ name: req.body.name, itemId: { $ne: itemId } });
    if (existingItem) {
      return res.status(409).json({ 
        message: "Item with this name already exists", 
        itemId: existingItem.itemId 
      });
    }

    // Find and update the item
    const oldItem = await Item.findOne({ itemId });
    const updatedItem = await Item.findOneAndUpdate({ itemId }, updateData, { new: true, runValidators: true });

    // If no item is found to update, return 404
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Create a notification about the item name change
    let notificationMessage;
    if (oldItem.name !== req.body.name) {
      notificationMessage = `The item "${oldItem.name}" has been updated to "${req.body.name}".`;
    } else {
      notificationMessage = `The ingredients of the item "${oldItem.name}" have been updated.`;
    }
    
    const notification = await Notification.create({
      title: `Item Updated: ${itemId}`,
      message: notificationMessage,  // Dynamic message with old and new name
      type: 'Items',
      isRead: false,
      metadata: { itemId },  // Add itemId or more metadata if necessary
    });

    // Respond with a success message, the updated item, and the notification
    res.status(200).json({ message: "Item updated successfully", updatedItem, notification });
  } catch (error) {
    res.status(400).json({ message: "Error updating item", error: error.message });
  }
};
