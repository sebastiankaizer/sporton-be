"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @description Product Routes
 * Base Path: /api/products
 */
/* --- PUBLIC ROUTES --- */
// Mendapatkan semua produk (biasanya untuk tampilan katalog)
router.get("/", product_controller_1.getProducts);
// Mendapatkan detail produk berdasarkan ID
router.get("/:id", product_controller_1.getProductById);
/* --- PROTECTED ROUTES (Admin Privileges) --- */
// Menambahkan produk baru dengan upload gambar
router.post("/", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), product_controller_1.createProduct);
// Memperbarui data produk dan/atau mengganti gambar produk
router.put("/:id", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), product_controller_1.updateProduct);
// Menghapus produk dari database
router.delete("/:id", auth_middleware_1.authenticate, product_controller_1.deleteProduct);
exports.default = router;
