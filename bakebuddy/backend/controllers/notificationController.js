import Notification from "../models/ingredientModel.js"

export const getNotificationData =  async (req,res)=>{
    res.status(200).json({ message: "Success getNotificationData" });
}

export const getCustomNotificationData =  async (req,res)=>{
    res.status(200).json({ message: "Success getCustomNotificationData" });
    
}

export const createNotificationData = async (req, res) => {
    res.status(200).json({ message: "Success createNotificationData" });
};


export const updateNotificationData = async (req, res) => {
    res.status(200).json({ message: "Success updateNotificationData" });
};


export const deleteNotificationData = async (req, res) => {
    res.status(200).json({ message: "Success deleteNotificationData" });
};