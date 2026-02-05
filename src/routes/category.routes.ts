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
import { validateCategory, validateParamId } from "../middlewares/validator.middleware";

const router = Router();

/**
 * CATEGORY ROUTES
 * Base Path: /api/categories
 */

/* --- PUBLIC ROUTES --- */

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get("/:id", validateParamId, getCategoryById);

/* --- PROTECTED ROUTES (Admin Only) --- */

/**
 * @route   POST /api/categories
 * @desc    Create new category with image upload
 * @access  Private (Admin)
 */
router.post(
  "/",
  authenticate,
  upload.single("image"),
  validateCategory,
  createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category data and/or image
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  validateParamId,
  upload.single("image"),
  validateCategory,
  updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, validateParamId, deleteCategory);

export default router;