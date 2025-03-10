import mongoose from "mongoose";

export const connectDB = async () => {
    try{
       const conn = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log(`MongoDB connected: ${conn.connection.host}`);

        }

    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

}
