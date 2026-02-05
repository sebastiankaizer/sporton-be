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
import { validateProduct, validateParamId } from "../middlewares/validator.middleware";

const router = Router();

/**
 * PRODUCT ROUTES
 * Base Path: /api/products
 */

/* --- PUBLIC ROUTES --- */

/**
 * @route   GET /api/products
 * @desc    Get all products (with optional filters: category, search, minPrice, maxPrice)
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", validateParamId, getProductById);

/* --- PROTECTED ROUTES (Admin Only) --- */

/**
 * @route   POST /api/products
 * @desc    Create new product with image upload
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateProduct,
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product data and/or image
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  validateParamId,
  upload.single("image"),
  validateProduct,
  updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, validateParamId, deleteProduct);

export default router;