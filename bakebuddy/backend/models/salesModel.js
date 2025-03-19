import mongoose from "mongoose";

const salesSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    itemCode: {
        type: String,
        required: true, 
    },
    itemName: {
        type: String  
    },
    buyerName: {
        type: String,
    },
    salesQuentity: {  
        type: String,
        required: true,  
    },
}, { timestamps: true });

const Sales = mongoose.model("Sales", salesSchema);
export default Sales;

// import mongoose from "mongoose";

// // Assuming you have an Item model that contains a unique itemCode field
// import Item from "./itemModel.js";  // Import the Item model (adjust the path if necessary)

// const salesSchema = mongoose.Schema({
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   itemCode: {
//     type: mongoose.Schema.Types.ObjectId,  // Reference to the Item model
//     ref: "Item",  // Model name being referenced
//     required: true,
//   },
//   itemName: {
//     type: String
//   },
//   buyerName: {
//     type: String,
//   },
//   salesQuantity: {  // Fixed spelling (was "salesQuentity")
//     type: Number,  // Changed to Number for quantity
//     required: true,  // Fixed "require" to "required"
//   },
// }, { timestamps: true });


// const Sales = mongoose.model("Sales", salesSchema);
// export default Sales;
