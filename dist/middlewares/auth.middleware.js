"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";
/**
 * Middleware untuk memvalidasi Token JWT pada route yang diproteksi
 */
const authenticate = (req, res, next) => {
    // 1. Ambil token dari header Authorization
    const authHeader = req.header("Authorization");
    // 2. Cek apakah header Authorization ada dan menggunakan format 'Bearer <token>'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Access Denied: No token provided or invalid format. Please use 'Bearer <token>'"
        });
        return;
    }
    // 3. Ekstrak token saja (menghapus kata 'Bearer ')
    const token = authHeader.replace("Bearer ", "");
    try {
        // 4. Verifikasi token menggunakan JWT_SECRET
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // 5. Jika valid, simpan hasil decode (payload) ke dalam req.user
        req.user = decoded;
        // 6. Lanjutkan ke fungsi/controller berikutnya
        next();
    }
    catch (error) {
        // Log error untuk keperluan internal debugging
        console.error("JWT Verification Error:", error);
        // 7. Kirim response jika token kadaluwarsa atau tidak valid
        res.status(401).json({
            success: false,
            message: "Authentication Failed: Your session has expired or the token is invalid"
        });
    }
};
exports.authenticate = authenticate;
