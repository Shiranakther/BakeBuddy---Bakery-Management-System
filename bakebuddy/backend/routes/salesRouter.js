import express from 'express';
import { createSales,viewAllSales,viewSalesById,updateSales,deleteSales } from '../controllers/salesController.js';

const router = express.Router();

router.post('/create', createSales);
router.get('/view', viewAllSales);
router.get('/view/:id', viewSalesById);
router.put('/update/:id', updateSales);
router.delete('/delete/:id', deleteSales);


export default router;