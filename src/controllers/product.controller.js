import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { successResponse, errorResponse } from "../utils/response.js";
import { response } from "express";

const cleanImageUrl = (base, imagePath) => {
    base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { inventory: true }
        });
        const base = `${req.protocol}://${req.get("host")}`; // mendapatkan value http://localhost:5000
        const productImages = products.map((product) => ({
            ...product,
            image: product.image ? cleanImageUrl(base, product.image) : null,
        }));

        return successResponse(res, "berhasil menampilkan semua data products", productImages);
    } catch (error) {
        return errorResponse(res, "gagal menampilkan semua data products", { error: error.message }, 500);
    }
}

export const getProductByInventoryId = async (req, res) => {
    try {
        const { id } = req.params; // ambil url parameter id
        const product = await prisma.product.findMany({
            where: { inventoryId: id }
        });

        // cek apakah produk yg dicari ada
        if(!product || product.length === 0){
            return errorResponse(res, 'product not found', null, 404);
        }

        const base = `${req.protocol}://${req.get("host")}`;
        const productImages = product.map((p) => ({
            ...p,
            image: p.image ? cleanImageUrl(base, p.image) : null,
        }));

        return successResponse(res, 'berhasil menampilkan data product by inventory id', productImages);
    } catch (error) {
        return errorResponse(res, "gagal menampilkan data product by inventory", { error: error.message }, 500);
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: id }
        });

        if(!product){
            return errorResponse(res, 'Product not found', null, 404);
        }

        const base = `${req.protocol}://${req.get("host")}`;
        const productImageWithUrl = {
            ...product,
            image: product.image ? cleanImageUrl(base, product.image) : null,
        };

        return successResponse(res, 'berhasil mendapatkan product berdasarkan id', productImageWithUrl);
    } catch (error) {
        return errorResponse(res, 'gagal mendapatkan product by id', { error: error.message }, 500);
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, price, stock, description, inventoryId } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const product = await prisma.product.create({
            data: {
                name: name,
                price: parseFloat(price),
                stock: parseInt(stock),
                description: description,
                image: image,
                inventoryId: inventoryId
            }
        });

        const base = `${req.protocol}://${req.get("host")}`;
        
        return successResponse(res, 'berhasil membuat data product', {
            ...product,
            image: product.image ? `${base}${product.image}` : null,
        });
    } catch (error) {
        return errorResponse(res, 'gagal membuat data product', null, 500);
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, description, inventoryId } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;

        const product = await prisma.product.findUnique({
            where: { id: id }
        });

        if(!product) return errorResponse(res, 'product tidak ditemukan', null, 404);

        // cek jika ada image, hapus image lama di DB
        if(image && product.image){
            const oldImagePath = path.join(
                process.cwd(),
                'uploads',
                path.basename(product.image)
            );

            fs.unlink(oldImagePath, (err) => {
                if(err){
                    console.warn('gagal hapus file image lama: ', oldImagePath);
                } else {
                    console.warn('file image lama terhapus: ', oldImagePath);
                }
            });
        }

        const updateData = {
            name: name,
            price: parseFloat(price),
            stock: parseInt(stock),
            description: description,
            inventoryId: inventoryId,
        }
        if (image){
            updateData.image = image;
        }

        const updateProduct = await prisma.product.update({
            where: { id: id },
            data: updateData
        });

        // url dinamis
        const base = `${req.protocol}://${req.get("host")}`;

        return successResponse(res, 'berhasil melakukan update data', {
            ...updateProduct,
            image: updateProduct.image ? `${base}${updateProduct.image}` : null,
        });
    } catch (error) {
        return errorResponse(res, 'gagal melakukan update data', null, 500);
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // cari produk lama di DB
        const product = await prisma.product.findUnique({
            where: { id: id }
        });

        if(!product) return errorResponse(res, 'product tidak ditemukan', null, 404);

        // cek jika ada image, hapus image lama di DB
        if(product.image){
            const oldImagePath = path.join(
                process.cwd(),
                'uploads',
                path.basename(product.image)
            );

            fs.unlink(oldImagePath, (err) => {
                if(err){
                    console.warn('gagal hapus file image lama: ', oldImagePath);
                } else {
                    console.warn('file image lama terhapus: ', oldImagePath);
                }
            });

            // hapus data di DB
            const deleteProduct = await prisma.product.delete({ where: {id: id }});

            return successResponse(res, 'berhasil melakukan delete product', deleteProduct.name);
        }

    } catch (error) {
        return errorResponse(res, 'gagal melakukan delete product', { error: error.message}, 500);
    }
}