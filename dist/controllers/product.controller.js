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
/**
 * @description Membuat Produk baru
 * @route POST /api/products
 */
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, category } = req.body;
        // 1. Validasi Input Dasar
        if (!name || !price || !category) {
            res.status(400).json({
                success: false,
                message: "Name, price, and category are required fields"
            });
            return;
        }
        const productData = {
            name,
            description,
            price,
            stock,
            category,
            imageUrl: req.file ? req.file.path : undefined
        };
        // 2. Simpan ke Database
        const product = new product_model_1.default(productData);
        yield product.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    }
    catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.createProduct = createProduct;
/**
 * @description Mengambil semua daftar produk (dengan info kategori)
 * @route GET /api/products
 */
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mengambil semua produk dan melakukan join (populate) dengan model Category
        const products = yield product_model_1.default.find()
            .populate("category", "name") // Hanya mengambil field 'name' dari category
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error
        });
    }
});
exports.getProducts = getProducts;
/**
 * @description Mengambil detail satu produk berdasarkan ID
 * @route GET /api/products/:id
 */
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findById(id).populate("category");
        if (!product) {
            res.status(404).json({
                success: false,
                message: `Product with ID ${id} not found`
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product found",
            data: product
        });
    }
    catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error
        });
    }
});
exports.getProductById = getProductById;
/**
 * @description Memperbarui data produk
 * @route PUT /api/products/:id
 */
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = Object.assign({}, req.body);
        // Update imageUrl jika ada file baru yang diunggah
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }
        const product = yield product_model_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("category");
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found, update failed"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    }
    catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error
        });
    }
});
exports.updateProduct = updateProduct;
/**
 * @description Menghapus produk
 * @route DELETE /api/products/:id
 */
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found, deletion failed"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
    catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error
        });
    }
});
exports.deleteProduct = deleteProduct;
