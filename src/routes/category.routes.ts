import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { upload } from "../middlewares/upload.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * PUBLIC ROUTES
 * Rute yang bisa diakses oleh siapa saja (misal: untuk tampilan pembeli)
 */
router.get("/", getCategories);
router.get("/:id", getCategoryById);

/**
 * PROTECTED ROUTES (Admin Only)
 * Rute yang memerlukan autentikasi dan penanganan file upload
 */

// Menambahkan kategori baru dengan upload gambar
router.post(
  "/", 
  authenticate, 
  upload.single("image"), 
  createCategory
);

// Memperbarui data kategori (mendukung update gambar)
router.put(
  "/:id", 
  authenticate, 
  upload.single("image"), 
  updateCategory
);

// Menghapus kategori
router.delete(
  "/:id", 
  authenticate, 
  deleteCategory
);

export default router;