
import express from "express";
import { 
    checkout,
    getAllInvoices,
    getInvoiceById,
    getInvoiceByUserEmail,
 } from "../controllers/invoice.controller.js";
 import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router();
router.use(verifyToken);

router.post('/checkout', checkout);
router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.get('/user/:email', getInvoiceByUserEmail);

// export
export default router;