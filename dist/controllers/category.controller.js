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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
/**
 * @description Create a new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
exports.createCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, description } = req.body;
    // Cek duplikasi nama kategori
    const existingCategory = yield category_model_1.default.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existingCategory) {
        throw ApiError_1.ApiError.conflict(`Category with name '${name}' already exists`);
    }
    const categoryData = {
        name,
        description,
        imageUrl: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
    };
    const category = new category_model_1.default(categoryData);
    yield category.save();
    response_1.ResponseHandler.created(res, "Category created successfully", category);
}));
/**
 * @description Get all categories
 * @route GET /api/categories
 * @access Public
 */
exports.getCategories = (0, asyncHandler_1.asyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.find().sort({ createdAt: -1 });
    response_1.ResponseHandler.ok(res, "Categories fetched successfully", categories, categories.length);
}));
/**
 * @description Get single category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
exports.getCategoryById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw ApiError_1.ApiError.notFound(`Category with ID '${id}' not found`);
    }
    response_1.ResponseHandler.ok(res, "Category found", category);
}));
/**
 * @description Update category
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
exports.updateCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const updateData = Object.assign({}, req.body);
    // Cek duplikasi nama jika nama diubah
    if (name) {
        const existingCategory = yield category_model_1.default.findOne({
            _id: { $ne: id },
            name: { $regex: new RegExp(`^${name}$`, "i") },
        });
        if (existingCategory) {
            throw ApiError_1.ApiError.conflict(`Category with name '${name}' already exists`);
        }
    }
    // Update imageUrl jika ada file baru
    if (req.file) {
        updateData.imageUrl = req.file.path;
    }
    const category = yield category_model_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        throw ApiError_1.ApiError.notFound("Category not found, update failed");
    }
    response_1.ResponseHandler.ok(res, "Category updated successfully", category);
}));
/**
 * @description Delete category
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
exports.deleteCategory = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Cek apakah ada produk yang menggunakan kategori ini
    const productCount = yield product_model_1.default.countDocuments({ category: id });
    if (productCount > 0) {
        throw ApiError_1.ApiError.conflict(`Cannot delete category. ${productCount} product(s) are using this category. Please reassign or delete those products first.`);
    }
    const category = yield category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw ApiError_1.ApiError.notFound("Category not found, deletion failed");
    }
    response_1.ResponseHandler.ok(res, "Category deleted successfully");
}));
