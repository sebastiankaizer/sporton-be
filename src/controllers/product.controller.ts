import { Request, Response } from "express";
import Product from "../models/product.model";

/**
 * @description Membuat Produk baru
 * @route POST /api/products
 */
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating product", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

/**
 * @description Mengambil semua daftar produk (dengan info kategori)
 * @route GET /api/products
 */
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Mengambil semua produk dan melakukan join (populate) dengan model Category
    const products = await Product.find()
      .populate("category", "name") // Hanya mengambil field 'name' dari category
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching products", 
      error 
    });
  }
};

/**
 * @description Mengambil detail satu produk berdasarkan ID
 * @route GET /api/products/:id
 */
export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");

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
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching product", 
      error 
    });
  }
};

/**
 * @description Memperbarui data produk
 * @route PUT /api/products/:id
 */
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Update imageUrl jika ada file baru yang diunggah
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true },
    ).populate("category");

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
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating product", 
      error 
    });
  }
};

/**
 * @description Menghapus produk
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

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
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting product", 
      error 
    });
  }
};