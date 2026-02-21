import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js"
import cookieOptions from "../utils/cookieOptions.js"

export const register = async (req, res) => {
    const { name, email, password } =  req.body;

    // cek apakah email sudah digunakan
    const existedEmail = await prisma.user.findUnique({ where: { email:email }});
    if(existedEmail) return errorResponse(res, 'Invalid email or password', null, 400);

    // Hash password 
    const hashed = await bcrypt.hash(password, 10);

    // Insert data ke database
    const user = await prisma.user.create({
       data:{
        name: name,
        email: email,
        password: hashed,
       } 
    });

    // return response
    return successResponse(res, 'Registrasi berhasil', {
        id: user.id,
        name: user.name,
        email: user.email,
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // cek email ada atau tidak
    const user = await prisma.user.findUnique({ where : { email: email }});
    if(!user) return errorResponse(res, 'Email tidak ditemukan', null, 401);

    // compare password
    const match = await bcrypt.compare(password, user.password);
    if(!match) return errorResponse(res, 'Invalid email atau password', null, 401);

    // buat JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie('token', token, cookieOptions(req));

    return successResponse(res, 'Login berhasil', {
        userId: user.id,
        email: email,
        token: token,
    });

};

export const logout = async (req, res) => {
    res.clearCookie("token", {
        ...cookieOptions(res),
        maxAge: undefined,  // override maxAge, agar cookie benar benar terhapus
    });

      return successResponse(res, 'Logout berhasil');
};

// export default { register, login, logout }