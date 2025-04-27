import express from "express"
const router = express.Router();

import {  getNotificationData,createNotificationData,getCustomNotificationData,updateNotificationData,deleteNotificationData} from "../controllers/notificationController.js";

router.route("/").get(getNotificationData);

router.route("/").post(createNotificationData);

router.route("/:id").get(getCustomNotificationData);

router.route("/:id").put(updateNotificationData);

router.route("/:id").delete(deleteNotificationData);


export default router ;