import Notification from "../models/notificationModel.js"

export const getNotificationData =  async (req,res)=>{
   try{
        const notification = await Notification.find();
        res.status(200).json(notification)
    }
    catch(e){
        console.log(e)
    }
   }

export const getCustomNotificationData =  async (req,res)=>{
    res.status(200).json({ message: "Success getCustomNotificationData" });
    
}

export const createNotificationData = async (req, res) => {
  
    let { title, message, type, isRead, metadata } = req.body;
    if (!title || !message || !type) {
        res.status(400).json({ msg: "Please enter all fields" });
    }
    if (!isRead) {
        isRead = false; // Default value for isRead
    }
    if (!metadata) {
        metadata = {}; // Default value for metadata
    }
    try {
        const notification = await Notification.create({
            title,
            message,
            type,
            isRead,
            metadata
        });
        res.status(201).json(notification);
    } catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }

};


export const updateNotificationData = async (req, res) => {
    res.status(200).json({ message: "Success updateNotificationData" });
};


export const deleteNotificationData = async (req, res) => {
    res.status(200).json({ message: "Success deleteNotificationData" });
};