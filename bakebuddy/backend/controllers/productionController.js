import Production from "../models/productionModel.js"
import Ingredient from '../models/ingredientModel.js'
import Item from '../models/itemModel.js';

export const getProductionData =  async (req,res)=>{

    try{
        const production = await Production.find();
        res.status(200).json(production)
    }catch(e){
        console.log(e)
    }
}    

export const getCustomProductionData = async (req,res)=>{
    const production = await Production.findById(req.params.id);
    try{
    if(!production){
        res.status(404);
        throw new Error("Production Not Found");
    }
    res.status(200).json(production)

    }catch(e){
        console.log(e);

    }
    
}

// export const createProduction = async (req,res)=>{
//     let {productCode,productName,date,quantity,remarks} = req.body;

//     if(!productCode ||!productName || !quantity ){
//         res.status(400).json({msg:"Please enter all fields"})
//     }

//     if (!date) {
//         date = new Date(); // Use current timestamp if date is missing
//     }

//     try{
//         const production = await Production.create(
//             {
//             productCode,
//             productName,
//             date,
//             quantity,
//             remarks
//             }

//         );

//         try {
//             const item = await Item.findOne({ itemId: productCode });
//             console.log(item.ingredients);
//             const ingredients = item.ingredients;

//             const ingredient = await Ingredient.findOne({ ingredientId: ingredients });
//             console.log(item.ingredients);


            

//         } catch (itemError) {
//             console.error("Error fetching item:", itemError);
//         }
//         res.status(201).json(production)

//     }catch(e){
//         console.log(e);
//         res.status(500).json({ msg: "Error creating production" });
//     }
    
// }

export const createProduction = async (req, res) => {
    let { productCode, productName, date, quantity, remarks } = req.body;

    if (!productCode || !productName || !quantity) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (!date) {
        date = new Date(); // Use current timestamp if date is missing
    }

    try {
        // Create the production record
        const production = await Production.create({
            productCode,
            productName,
            date,
            quantity,
            remarks
        });

        try {
            // Find the item by productCode
            const item = await Item.findOne({ itemId: productCode });
            if (!item) {
                return res.status(404).json({ msg: "Item not found" });
            }

            console.log("Ingredients before update:", item.ingredients);

            // Loop through each ingredient and update its ingredientQuantity
            for (let ingredient of item.ingredients) {
                const { ingredientId, volume } = ingredient;

                // Find the corresponding ingredient in the Ingredient collection
                const existingIngredient = await Ingredient.findOne({ ingredientId });
                if (!existingIngredient) {
                    console.warn(`Ingredient ${ingredientId} not found in the database.`);
                    continue; // Skip this ingredient if not found
                }

                // Calculate new quantity
                let newQuantity = existingIngredient.ingredientQuantity - (quantity * volume);
                if (newQuantity < 0) {
                    newQuantity = 0; // Prevent negative values
                    return res.status(400).json({ msg: `Insufficient stock for ingredient ${ingredientId}.` });
                }

                // Update the ingredient quantity in the database
                await Ingredient.updateOne(
                    { ingredientId },
                    { $set: { ingredientQuantity: newQuantity } }
                );

                console.log(`Updated ingredient ${ingredientId}: New quantity = ${newQuantity}`);
            }

            console.log("Ingredients updated successfully.");
        } catch (itemError) {
            console.error("Error processing ingredients:", itemError);
        }

        res.status(201).json(production);
    } catch (e) {
        console.error("Error creating production:", e);
        res.status(500).json({ msg: "Error creating production" });
    }
};


export const updateProduction = async (req, res) => {
    try {
        const production = await Production.findById(req.params.id);
        if (!production) {
            return res.status(404).json({ msg: "Production Not Found" });
        }

        const { quantity: newQuantity, remarks: newRemarks } = req.body; // Extract new quantity and remarks
        const oldQuantity = production.quantity; // Get previous quantity

        if (newQuantity === oldQuantity && newRemarks === production.remarks) {
            return res.status(200).json(production); // No change needed if both are the same
        }

        // Fetch the item linked to this production
        const item = await Item.findOne({ itemId: production.productCode });
        if (!item) {
            return res.status(404).json({ msg: "Item Not Found" });
        }

        console.log("Item Ingredients:", item.ingredients);

        // Loop through each ingredient and adjust stock
        for (let ingredient of item.ingredients) {
            const { ingredientId, volume } = ingredient;

            if (!volume || isNaN(volume)) {
                console.warn(`Invalid volume for ingredient ${ingredientId}`);
                continue;
            }

            // Fetch existing ingredient details
            const existingIngredient = await Ingredient.findOne({ ingredientId });
            if (!existingIngredient) {
                console.warn(`Ingredient ${ingredientId} not found.`);
                continue;
            }

            if (existingIngredient.ingredientQuantity === undefined) {
                console.warn(`Missing ingredientQuantity for ${ingredientId}`);
                continue;
            }

            let quantityDifference = newQuantity - oldQuantity; // Calculate difference
            let newStock = existingIngredient.ingredientQuantity - (quantityDifference * volume);

            // Ensure stock doesn't go negative
            if (newStock < 0) {
                console.warn(`Insufficient stock for ingredient ${ingredientId}.`);
                newStock = 0;
            }

            // Update ingredient stock
            await Ingredient.updateOne(
                { ingredientId },
                { $set: { ingredientQuantity: newStock } }
            );

            console.log(`Updated ${ingredientId}: New stock = ${newStock}`);
        }

        // Update the production record with the new quantity and remarks
        const updatedProduction = await Production.findByIdAndUpdate(
            req.params.id,
            { quantity: newQuantity, remarks: newRemarks }, // Update both fields
            { new: true }
        );

        console.log('Updated production:', updatedProduction);
        res.status(200).json(updatedProduction);
    } catch (e) {
        console.error("Error updating production:", e);
        res.status(500).json({ msg: "Error updating production" });
    }
};


export const deleteProduction = async (req, res) => {
    try {
        const production = await Production.findById(req.params.id);
        if (!production) {
            return res.status(404).json({ msg: "Production Not Found" });
        }

        // Fetch the item related to this production
        const item = await Item.findOne({ itemId: production.productCode });
        if (!item) {
            return res.status(404).json({ msg: "Item Not Found" });
        }

        console.log("Restoring Ingredients:", item.ingredients);

        // Loop through each ingredient and increase stock
        for (let ingredient of item.ingredients) {
            const { ingredientId, volume } = ingredient;

            if (!volume || isNaN(volume)) {
                console.warn(`Invalid volume for ingredient ${ingredientId}`);
                continue;
            }

            // Find the ingredient in the Ingredient collection
            const existingIngredient = await Ingredient.findOne({ ingredientId });
            if (!existingIngredient) {
                console.warn(`Ingredient ${ingredientId} not found.`);
                continue;
            }

            if (existingIngredient.ingredientQuantity === undefined) {
                console.warn(`Missing ingredientQuantity for ${ingredientId}`);
                continue;
            }

            // Calculate the restored stock
            let restoredQuantity = existingIngredient.ingredientQuantity + (production.quantity * volume);

            // Update ingredient stock
            await Ingredient.updateOne(
                { ingredientId },
                { $set: { ingredientQuantity: restoredQuantity } }
            );

            console.log(`Restored ${ingredientId}: New stock = ${restoredQuantity}`);
        }

        // Delete the production record
        await Production.deleteOne({ _id: production._id });

        res.status(200).json({ msg: "Production deleted successfully" });

    } catch (e) {
        console.error("Error deleting production:", e);
        res.status(500).json({ msg: "Error deleting production" });
    }
};