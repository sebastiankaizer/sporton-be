import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { upload } from "../middlewares/upload.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @description Product Routes
 * Base Path: /api/products
 */

/* --- PUBLIC ROUTES --- */

// Mendapatkan semua produk (biasanya untuk tampilan katalog)
router.get("/", getProducts);

// Mendapatkan detail produk berdasarkan ID
router.get("/:id", getProductById);


/* --- PROTECTED ROUTES (Admin Privileges) --- */

// Menambahkan produk baru dengan upload gambar
router.post(
  "/", 
  authenticate, 
  upload.single("image"), 
  createProduct
);

// Memperbarui data produk dan/atau mengganti gambar produk
router.put(
  "/:id", 
  authenticate, 
  upload.single("image"), 
  updateProduct
);

// Menghapus produk dari database
router.delete(
  "/:id", 
  authenticate, 
  deleteProduct
);

export default router;