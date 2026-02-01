import { Request, Response } from "express";
import Category from "../models/category.model";

/**
 * @description Membuat Kategori baru
 * @route POST /api/categories
 */
export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating Category", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

/**
 * @description Mengambil semua daftar kategori
 * @route GET /api/categories
 */
export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Mengambil semua kategori, diurutkan dari yang terbaru
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching categories", 
      error 
    });
  }
};

/**
 * @description Mengambil satu kategori berdasarkan ID
 * @route GET /api/categories/:id
 */
export const getCategoryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

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
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching category", 
      error 
    });
  }
};

/**
 * @description Memperbarui data kategori
 * @route PUT /api/categories/:id
 */
export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Jika ada file gambar baru yang diupload
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }, // 'new' mengembalikan data setelah update, 'runValidators' memastikan validasi model jalan
    );

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
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating category", 
      error 
    });
  }
};

/**
 * @description Menghapus kategori
 * @route DELETE /api/categories/:id
 */
export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

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
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting category", 
      error 
    });
  }
};