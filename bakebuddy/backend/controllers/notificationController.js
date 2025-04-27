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
    const { id } = req.params;
    const { title, message, type, isRead, metadata } = req.body;

    if (!title || !message || !type) {
        return res.status(400).json({ msg: "Please enter all required fields" });
    }

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        notification.title = title || notification.title;
        notification.message = message || notification.message;
        notification.type = type || notification.type;
        notification.isRead = isRead !== undefined ? isRead : notification.isRead;
        notification.metadata = metadata || notification.metadata;

        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteNotificationData = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        await notification.remove();

        res.status(200).json({ msg: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};