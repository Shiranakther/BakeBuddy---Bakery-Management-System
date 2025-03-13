import express from "express";
import dotenv from "dotenv";
import router from "./routes/route.js";
import productionRoutes  from "./routes/productionRoutes.js"
import {connectDB} from "./connection/connectDB.js";
import salesRoutes from './routes/route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 

app.use("/api/production",productionRoutes);
app.use("/api/sales", salesRoutes);

app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})
