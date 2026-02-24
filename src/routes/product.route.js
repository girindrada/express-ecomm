import express from "express"
import { upload } from "../middleware/upload.js"
import { verifyToken } from "../middleware/verifyToken.js"
import {
    getAllProducts,
    getProductById,
    getProductByInventoryId,
    createProduct,
    updateProduct,
    deleteProduct,
 } from "../controllers/product.controller.js"

 const router = express.Router();

 router.get("/", getAllProducts);
 router.get("/:id", getProductById);
 router.get("/inventories/:id", getProductByInventoryId);
 router.post("/", verifyToken, upload.single("image"), createProduct);
 router.put("/:id", verifyToken, upload.single("image"), updateProduct);
 router.delete("/:id", verifyToken, deleteProduct);

 export default router;