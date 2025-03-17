import mongoose from "mongoose";

const salesSchema = mongoose.Schema({

    date:{
        type : Date,
        required : true,
    },
    itemCode:{
        type : String,
        unique:true,
    },
    
    itemName:{
        type:String,
        unique:true,
    },
    buyerName:{
        type:String,
    },
    salesQuentity:{
        type:String,
        require:true,
    },

},{timestamps:true});

const Sales = mongoose.model("Sales",salesSchema);
export default Sales;