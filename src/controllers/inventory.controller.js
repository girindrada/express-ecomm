import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js"

export const getInventories = async (req, res) => {
    const inventories = await prisma.inventory.findMany();

    return successResponse(res, 'sukses mengambil semua data inventory', inventories);
};

export const getInventory = async (req, res) => {
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({ where: {id: id}});

    if(!inventory){
        return errorResponse(res, "id dari data inventory tidak ditemukan", null, 401);
    }

    return successResponse(res, "sukses mengambil data inventory berdasarkan id", inventory);
};

export const createInventory = async (req, res) => {
    const { name, description } = req.body;

    if(!name || !description) {
        return errorResponse(res, "data tidak boleh kosong", null, 401);
    }

    const inventory = await prisma.inventory.create({
        data: {
            name: name,
            description: description,
        }
    });

    return successResponse(res, "berhasil menambahkan data inventory", inventory);
};

export const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if(!name || !description){
        return errorResponse(res, "data tidak boleh kosong", null, 401);
    }

    const inventory = await prisma.inventory.update({
        where: { id: id },
        data: {
            name: name,
            description: description,
        }
    });

    return successResponse(res, "berhasil update data inventory", inventory);
};

export const deleteInventory = async (req, res) => {
    const { id } = req.params;

    const inventory = await prisma.inventory.delete({
        where: { id: id }
    });

    return successResponse(res, "berhasil delete data inventory", inventory);
};

