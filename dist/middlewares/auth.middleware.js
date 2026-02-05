"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const ApiError_1 = require("../utils/ApiError");
/**
 * Middleware untuk memvalidasi Token JWT pada route yang diproteksi
 */
const authenticate = (req, res, next) => {
    try {
        // 1. Ambil token dari header Authorization
        const authHeader = req.header("Authorization");
        // 2. Cek apakah header Authorization ada dan menggunakan format 'Bearer <token>'
        if (!authHeader) {
            throw ApiError_1.ApiError.unauthorized("Access Denied: No token provided");
        }
        if (!authHeader.startsWith("Bearer ")) {
            throw ApiError_1.ApiError.unauthorized("Access Denied: Invalid token format. Use 'Bearer <token>'");
        }
        // 3. Ekstrak token saja (menghapus kata 'Bearer ')
        const token = authHeader.slice(7);
        if (!token) {
            throw ApiError_1.ApiError.unauthorized("Access Denied: Token is empty");
        }
        // 4. Verifikasi token menggunakan JWT_SECRET
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        // 5. Jika valid, simpan hasil decode (payload) ke dalam req.user
        req.user = decoded;
        // 6. Lanjutkan ke fungsi/controller berikutnya
        next();
    }
    catch (error) {
        // Handle JWT specific errors
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw ApiError_1.ApiError.unauthorized("Invalid token. Please log in again.");
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw ApiError_1.ApiError.unauthorized("Your session has expired. Please log in again.");
        }
        // Re-throw ApiError or other errors
        throw error;
    }
};
exports.authenticate = authenticate;
/**
 * Middleware opsional untuk route yang bisa diakses dengan atau tanpa auth
 * Jika ada token valid, user info akan diattach ke request
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }
    const token = authHeader.slice(7);
    if (!token) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
    }
    catch (_a) {
        // Token invalid, tapi tidak apa-apa karena ini optional
    }
    next();
};
exports.optionalAuth = optionalAuth;
