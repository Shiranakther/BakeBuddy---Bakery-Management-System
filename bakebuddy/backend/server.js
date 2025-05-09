import express from "express";
import dotenv from "dotenv";
import productionRoutes  from "./routes/productionRoutes.js";
import itemRoutes from './routes/itemRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import {connectDB} from "./connection/connectDB.js";
import salesRoutes from './routes/salesRouter.js';  
import userRoutes from './routes/userRouter.js';   
import notificationRoutes from "./routes/notificationRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 
app.use(cors({
  origin: '*', 
}));

app.get("/", (req, res) => {
  res.send("Hello from the backend 👋");
});

app.use("/api/production",productionRoutes);
app.use('/api/item',itemRoutes);
app.use("/api/ingredients",ingredientRoutes);
app.use("/api/sales", salesRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/auth', userRoutes);


app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})
