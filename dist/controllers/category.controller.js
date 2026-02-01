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
/**
 * @description Membuat Kategori baru
 * @route POST /api/categories
 */
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        // 1. Validasi Input Dasar
        if (!name) {
            res.status(400).json({
                success: false,
                message: "Category name is required"
            });
            return;
        }
        const categoryData = {
            name,
            description,
            imageUrl: req.file ? req.file.path : undefined // Menangani upload file jika ada
        };
        // 2. Simpan ke Database
        const category = new category_model_1.default(categoryData);
        yield category.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    }
    catch (error) {
        console.error("Create Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating Category",
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.createCategory = createCategory;
/**
 * @description Mengambil semua daftar kategori
 * @route GET /api/categories
 */
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mengambil semua kategori, diurutkan dari yang terbaru
        const categories = yield category_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            count: categories.length,
            data: categories
        });
    }
    catch (error) {
        console.error("Get Categories Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error
        });
    }
});
exports.getCategories = getCategories;
/**
 * @description Mengambil satu kategori berdasarkan ID
 * @route GET /api/categories/:id
 */
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_model_1.default.findById(id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: `Category with ID ${id} not found`
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Category found",
            data: category
        });
    }
    catch (error) {
        console.error("Get Category By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error
        });
    }
});
exports.getCategoryById = getCategoryById;
/**
 * @description Memperbarui data kategori
 * @route PUT /api/categories/:id
 */
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = Object.assign({}, req.body);
        // Jika ada file gambar baru yang diupload
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        const category = yield category_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found, update failed"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    }
    catch (error) {
        console.error("Update Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error
        });
    }
});
exports.updateCategory = updateCategory;
/**
 * @description Menghapus kategori
 * @route DELETE /api/categories/:id
 */
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_model_1.default.findByIdAndDelete(id);
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found, deletion failed"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    }
    catch (error) {
        console.error("Delete Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error
        });
    }
});
exports.deleteCategory = deleteCategory;
