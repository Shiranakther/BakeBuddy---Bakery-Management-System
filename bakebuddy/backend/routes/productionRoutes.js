import express from "express"
const router = express.Router();

import { getProductionData,getCustomProductionData,createProduction,updateProduction,deleteProduction } from "../controllers/productionController.js";

router.route("/").get(getProductionData);

router.route("/").post(createProduction);

router.route("/:id").get(getCustomProductionData);

router.route("/:id").put(updateProduction);

router.route("/:id").delete(deleteProduction);


export default router ;