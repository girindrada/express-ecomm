import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js"

export const checkout = async (req, res) => {
    const { name, email, phone, date } = req.body;
    const userId = req.user.id; // user yang sedang login

    // ambil data cart user yang login
    const carts = await prisma.cart.findMany({
        where: { userId: userId },
        include: { product: true }
    });

    if (carts.length === 0) return res.status(400).json({
        error: "cart is empty"
    });

    const items = carts.map(cart => `${cart.product.name} x ${cart.quantity}`).join(", ");
    const total = carts.reduce((sum, item) => sum + item.total, 0);

    const invoice = await prisma.invoice.create({
        data: {
            email: email,
            name: name,
            phone: phone,
            date: new Date(date),
            items: items,
            total: total,
            userId: userId,
        }
    });

    // hapus cart items yang sudah berhasil dicreate, berdasarkan id user
    await prisma.cart.deleteMany({
        where: { userId: userId }
    }); 

    return successResponse(res, "checkout items successfully", invoice);
}

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany();
        return successResponse(res, "get all invoices succesfully", invoices);
    } catch (error) {
        return errorResponse(res, "failed to retrieve invoice data", { error: error.message }, 500);
    }
}

export const getInvoiceById = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        // console.log("id invoce nya adalah: " + invoiceId);

        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) return errorResponse(res, "invoice not found", null, 404);

        return successResponse(res, "get invoice by id succesfully", invoice);
    } catch (error) {
        return errorResponse(res, "get invoice by id failed", { error: error.message }, 500);
    }
}

export const getInvoiceByUserEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;

        const invoices = await prisma.invoice.findMany({
            where: { email: userEmail }
        });

        return successResponse(res, "get invoice by user email succesfully", invoices);
    } catch (error) {
        return errorResponse(res, "get invoice by user email failed", { error: error.message }, 500);
    }
}