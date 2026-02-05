"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = (0, express_1.Router)();
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
router.get("/", category_controller_1.getCategories);
/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get("/:id", validator_middleware_1.validateParamId, category_controller_1.getCategoryById);
/* --- PROTECTED ROUTES (Admin Only) --- */
/**
 * @route   POST /api/categories
 * @desc    Create new category with image upload
 * @access  Private (Admin)
 */
router.post("/", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), validator_middleware_1.validateCategory, category_controller_1.createCategory);
/**
 * @route   PUT /api/categories/:id
 * @desc    Update category data and/or image
 * @access  Private (Admin)
 */
router.put("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, upload_middleware_1.upload.single("image"), validator_middleware_1.validateCategory, category_controller_1.updateCategory);
/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin)
 */
router.delete("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, category_controller_1.deleteCategory);
exports.default = router;
