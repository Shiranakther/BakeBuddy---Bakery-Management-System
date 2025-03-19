import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productionRoutes from "./routes/productionRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";
import salesRoutes from "./routes/salesRouter.js";
import { connectDB } from "./connection/connectDB.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Define Routes
app.use("/api/production", productionRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/sales", salesRoutes);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
