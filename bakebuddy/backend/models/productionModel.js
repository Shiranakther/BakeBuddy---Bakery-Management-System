import mongoose from "mongoose"

const productionSchema = mongoose.Schema({
    productCode :{
        type : String,
        required : true
    },
    productName:{
        type : String,
        required : true
    },
    date:{
        type:Date,
        default:Date.now

    },
    quantity:{
        type:Number,
        required:true
    },
    remarks:{
        type:String
    },

},{timestamps:true});

const Production = mongoose.model("Production",productionSchema);
export default Production;