import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseHandler } from "../utils/response";
import { ApiError } from "../utils/ApiError";

/**
 * @description Create a new product
 * @route POST /api/products
 * @access Private (Admin)
 */
export const createProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description, price, stock, category } = req.body;

  // Validasi bahwa kategori yang diberikan ada
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw ApiError.badRequest("Invalid category. The specified category does not exist.");
  }

  const productData = {
    name,
    description,
    price,
    stock: stock || 0,
    category,
    imageUrl: req.file?.path,
  };

  const product = new Product(productData);
  await product.save();

  // Populate category untuk response
  await product.populate("category", "name");

  ResponseHandler.created(res, "Product created successfully", product);
});

/**
 * @description Get all products
 * @route GET /api/products
 * @query category - Filter by category ID
 * @query search - Search by product name
 * @query minPrice - Minimum price filter
 * @query maxPrice - Maximum price filter
 * @access Public
 */
export const getProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { category, search, minPrice, maxPrice } = req.query;

  // Build query object
  const query: Record<string, unknown> = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
  }

  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  ResponseHandler.ok(res, "Products fetched successfully", products, products.length);
});

/**
 * @description Get single product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw ApiError.notFound(`Product with ID '${id}' not found`);
  }

  ResponseHandler.ok(res, "Product found", product);
});

/**
 * @description Update product
 * @route PUT /api/products/:id
 * @access Private (Admin)
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { category } = req.body;
  const updateData = { ...req.body };

  // Jika kategori diubah, validasi bahwa kategori baru ada
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw ApiError.badRequest("Invalid category. The specified category does not exist.");
    }
  }

  // Update imageUrl jika ada file baru
  if (req.file) {
    updateData.imageUrl = req.file.path;
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category");

  if (!product) {
    throw ApiError.notFound("Product not found, update failed");
  }

  ResponseHandler.ok(res, "Product updated successfully", product);
});

/**
 * @description Delete product
 * @route DELETE /api/products/:id
 * @access Private (Admin)
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw ApiError.notFound("Product not found, deletion failed");
  }

  ResponseHandler.ok(res, "Product deleted successfully");
});