import express from "express";
import dotenv from "dotenv";
import routes from "./routes/route.js";
import {connectDB} from "./connection/connectDB.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 
app.get("/",(req,res)=>{
    res.send("Server is ready")
})

app.listen(PORT,(req,res)=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})
