import express from "express";
import dotenv from "dotenv";
import router from "./routes/route.js";
import productionRoutes  from "./routes/productionRoutes.js"
import itemRoutes from './routes/itemRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import {connectDB} from "./connection/connectDB.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 

app.use("/api/production",productionRoutes);
app.use('/api/item',itemRoutes);
app.use("/api/ingredients",ingredientRoutes);

app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})
