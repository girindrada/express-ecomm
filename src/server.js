import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors" 

import authRoutes from "./routes/auth.route.js"
import inventoryRoutes from "./routes/inventory.route.js"
import productRoutes from "./routes/product.route.js"

// load dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});