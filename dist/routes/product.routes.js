"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = (0, express_1.Router)();
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
router.get("/", product_controller_1.getProducts);
/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", validator_middleware_1.validateParamId, product_controller_1.getProductById);
/* --- PROTECTED ROUTES (Admin Only) --- */
/**
 * @route   POST /api/products
 * @desc    Create new product with image upload
 * @access  Private (Admin)
 */
router.post("/", auth_middleware_1.authenticate, upload_middleware_1.upload.single("image"), validator_middleware_1.validateProduct, product_controller_1.createProduct);
/**
 * @route   PUT /api/products/:id
 * @desc    Update product data and/or image
 * @access  Private (Admin)
 */
router.put("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, upload_middleware_1.upload.single("image"), validator_middleware_1.validateProduct, product_controller_1.updateProduct);
/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Admin)
 */
router.delete("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, product_controller_1.deleteProduct);
exports.default = router;
