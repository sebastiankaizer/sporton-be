"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * PUBLIC ROUTES
 * Rute yang bisa diakses oleh siapa saja (misal: untuk tampilan pembeli)
 */
router.get("/", category_controller_1.getCategories);
router.get("/:id", category_controller_1.getCategoryById);
/**
 * PROTECTED ROUTES (Admin Only)
 * Rute yang memerlukan autentikasi dan penanganan file upload
 */
// Menambahkan kategori baru dengan upload gambar
router.post("/", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), category_controller_1.createCategory);
// Memperbarui data kategori (mendukung update gambar)
router.put("/:id", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), category_controller_1.updateCategory);
// Menghapus kategori
router.delete("/:id", auth_middleware_1.authenticate, category_controller_1.deleteCategory);
exports.default = router;
