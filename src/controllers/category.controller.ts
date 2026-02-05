import { Request, Response } from "express";
import Category from "../models/category.model";
import Product from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseHandler } from "../utils/response";
import { ApiError } from "../utils/ApiError";

/**
 * @description Create a new category
 * @route POST /api/categories
 * @access Private (Admin)
 */
export const createCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;

  // Cek duplikasi nama kategori
  const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
  if (existingCategory) {
    throw ApiError.conflict(`Category with name '${name}' already exists`);
  }

  const categoryData = {
    name,
    description,
    imageUrl: req.file?.path,
  };

  const category = new Category(categoryData);
  await category.save();

  ResponseHandler.created(res, "Category created successfully", category);
});

/**
 * @description Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getCategories = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().sort({ createdAt: -1 });

  ResponseHandler.ok(res, "Categories fetched successfully", categories, categories.length);
});

/**
 * @description Get single category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    throw ApiError.notFound(`Category with ID '${id}' not found`);
  }

  ResponseHandler.ok(res, "Category found", category);
});

/**
 * @description Update category
 * @route PUT /api/categories/:id
 * @access Private (Admin)
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;
  const updateData = { ...req.body };

  // Cek duplikasi nama jika nama diubah
  if (name) {
    const existingCategory = await Category.findOne({
      _id: { $ne: id as string },
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      throw ApiError.conflict(`Category with name '${name}' already exists`);
    }
  }

  // Update imageUrl jika ada file baru
  if (req.file) {
    updateData.imageUrl = req.file.path;
  }

  const category = await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw ApiError.notFound("Category not found, update failed");
  }

  ResponseHandler.ok(res, "Category updated successfully", category);
});

/**
 * @description Delete category
 * @route DELETE /api/categories/:id
 * @access Private (Admin)
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Cek apakah ada produk yang menggunakan kategori ini
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw ApiError.conflict(
      `Cannot delete category. ${productCount} product(s) are using this category. Please reassign or delete those products first.`
    );
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw ApiError.notFound("Category not found, deletion failed");
  }

  ResponseHandler.ok(res, "Category deleted successfully");
});