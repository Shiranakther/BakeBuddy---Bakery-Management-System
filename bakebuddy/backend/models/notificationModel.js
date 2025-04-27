import mongoose from "mongoose"

const notificationSchema = mongoose.Schema(  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Ingredient", "Production", "Items", "Sales","Smartbake"],
      default: "system",
    },
    
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Object,
      default: {}, // optional additional info like orderId, itemId, etc.
    },
  },
  { timestamps: true }
)

const Notification = mongoose.model("Notification",notificationSchema);
export default Notification;