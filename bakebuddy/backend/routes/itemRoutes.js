
import express from 'express';  
import { create,getAllItems,deleteItem,updateItem } from '../controllers/itemController.js';

const router = express.Router();

router.post("/create", create);
router.get("/all", getAllItems);
router.delete('/:itemId', deleteItem);
router.put('/:itemId', updateItem);

export default router;
