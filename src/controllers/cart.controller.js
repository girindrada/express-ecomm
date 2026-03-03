import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js"

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) return errorResponse(res, "product not found", { error: "product not found" }, 404);

    const totalPrice = product.price * quantity;

    const cart = await prisma.cart.create({
        data: {
            productId: productId,
            quantity: quantity,
            total: totalPrice,
            userId: req.user.id,
        }
    });

    return successResponse(res, "cart added succsesfully", cart);
}

export const getAllCart = async (req, res) => {
    const cartItems = await prisma.cart.findMany({
        where: { userId: req.user.id },
        include: { product: true } 
    });

    return successResponse(res, "get all cart items succesfully", cartItems);
}