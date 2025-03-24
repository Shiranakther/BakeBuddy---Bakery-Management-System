
import express from "express"
import { 
    addIngredient, 
    getIngredients, 
    getIngredientById, 
    // updateDailyConsumption,
    updateIngredient,
    deleteIngredient,
    // getIngredientUsageByIdAndDateRange
} from "../controllers/ingredientController.js";

const router = express.Router();

router.route("/").get(getIngredients);
router.route("/").post(addIngredient);
router.route("/:id").get(getIngredientById);
// router.route("/:id/daily").put(updateDailyConsumption);
router.route("/:id").put(updateIngredient);
router.route("/:id").delete(deleteIngredient);
// router.route("/:id/usage").get(getIngredientUsageByIdAndDateRange);


export default router;
