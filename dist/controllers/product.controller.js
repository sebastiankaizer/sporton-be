"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
/**
 * @description Create a new product
 * @route POST /api/products
 * @access Private (Admin)
 */
exports.createProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description, price, stock, category } = req.body;
    // Validasi bahwa kategori yang diberikan ada
    const categoryExists = yield category_model_1.default.findById(category);
    if (!categoryExists) {
        throw ApiError_1.ApiError.badRequest("Invalid category. The specified category does not exist.");
    }
    const productData = {
        name,
        description,
        price,
        stock: stock || 0,
        category,
        imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
    };
    const product = new product_model_1.default(productData);
    yield product.save();
    // Populate category untuk response
    yield product.populate("category", "name");
    response_1.ResponseHandler.created(res, "Product created successfully", product);
}));
/**
 * @description Get all products
 * @route GET /api/products
 * @query category - Filter by category ID
 * @query search - Search by product name
 * @query minPrice - Minimum price filter
 * @query maxPrice - Maximum price filter
 * @access Public
 */
exports.getProducts = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, search, minPrice, maxPrice } = req.query;
    // Build query object
    const query = {};
    if (category) {
        query.category = category;
    }
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = Number(minPrice);
        if (maxPrice)
            query.price.$lte = Number(maxPrice);
    }
    const products = yield product_model_1.default.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 });
    response_1.ResponseHandler.ok(res, "Products fetched successfully", products, products.length);
}));
/**
 * @description Get single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
exports.getProductById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findById(id).populate("category");
    if (!product) {
        throw ApiError_1.ApiError.notFound(`Product with ID '${id}' not found`);
    }
    response_1.ResponseHandler.ok(res, "Product found", product);
}));
/**
 * @description Update product
 * @route PUT /api/products/:id
 * @access Private (Admin)
 */
exports.updateProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { category } = req.body;
    const updateData = Object.assign({}, req.body);
    // Jika kategori diubah, validasi bahwa kategori baru ada
    if (category) {
        const categoryExists = yield category_model_1.default.findById(category);
        if (!categoryExists) {
            throw ApiError_1.ApiError.badRequest("Invalid category. The specified category does not exist.");
        }
    }
    // Update imageUrl jika ada file baru
    if (req.file) {
        updateData.imageUrl = req.file.path;
    }
    const product = yield product_model_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate("category");
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found, update failed");
    }
    response_1.ResponseHandler.ok(res, "Product updated successfully", product);
}));
/**
 * @description Delete product
 * @route DELETE /api/products/:id
 * @access Private (Admin)
 */
exports.deleteProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findByIdAndDelete(id);
    if (!product) {
        throw ApiError_1.ApiError.notFound("Product not found, deletion failed");
    }
    response_1.ResponseHandler.ok(res, "Product deleted successfully");
}));
