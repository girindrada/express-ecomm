
import express from "express";
import { 
    getAllCart,
    addToCart
 } from "../controllers/cart.controller.js";
 import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router();

// pasang middleware
router.use(verifyToken);

router.get('/', getAllCart);
router.post('/', addToCart);

// export
export default router;