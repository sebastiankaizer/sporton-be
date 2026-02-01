"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const app = (0, express_1.default)();
// --- Konfigurasi Middleware ---
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Biar folder uploads bisa diakses lewat link (buat nampilin gambar produk)
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// --- Registrasi Semua Route ---
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/products", product_routes_1.default);
// Cek kalau API nyala
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Aman, API Sporton sudah jalan.",
        version: "1.0.0"
    });
});
// Buat ngetes token doang
app.get("/test-middleware", auth_middleware_1.authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token valid, kamu punya akses!",
        user: req.user
    });
});
// --- Handling Error & Route Ghoib ---
// Kalau user nembak route yang nggak ada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `URL ${req.originalUrl} nggak ketemu.`
    });
});
// Jaring pengaman kalau ada error di server (Internal Server Error)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error("Waduh, ada error nih:", err.message);
    res.status(status).json({
        success: false,
        message: err.message || "Terjadi kesalahan di server.",
        // Stack trace cuma muncul pas lagi development
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});
exports.default = app;
