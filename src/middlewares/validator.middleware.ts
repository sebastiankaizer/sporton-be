import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

/**
 * Validator Middleware Factory
 * Membuat middleware validasi yang reusable
 */

// Helper function untuk memeriksa apakah string adalah valid email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

// Helper function untuk memeriksa apakah string adalah valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validasi untuk Sign In
 */
export const validateSignIn = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  const errors: Record<string, string> = {};

  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize
  req.body.email = email.trim().toLowerCase();
  next();
};

/**
 * Validasi untuk Initiate Admin
 */
export const validateInitiateAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { email, password, name } = req.body;
  const errors: Record<string, string> = {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize
  req.body.email = email.trim().toLowerCase();
  req.body.name = name.trim();
  next();
};

/**
 * Validasi untuk Create/Update Category
 */
export const validateCategory = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { name, description } = req.body;
  const errors: Record<string, string> = {};
  const isUpdate = req.method === "PUT";

  // Untuk create, name wajib. Untuk update, opsional
  if (!isUpdate) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.name = "Category name is required";
    }
    if (!description || typeof description !== "string" || description.trim() === "") {
      errors.description = "Description is required";
    }
    if (!req.file) {
      errors.image = "Category image is required";
    }
  }

  // Validasi panjang jika ada
  if (name && typeof name === "string" && name.trim().length < 2) {
    errors.name = "Category name must be at least 2 characters long";
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize
  if (name) req.body.name = name.trim();
  if (description) req.body.description = description.trim();
  next();
};

/**
 * Validasi untuk Create/Update Product
 */
export const validateProduct = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { name, description, price, stock, category } = req.body;
  const errors: Record<string, string> = {};
  const isUpdate = req.method === "PUT";

  if (!isUpdate) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.name = "Product name is required";
    }
    if (!description || typeof description !== "string" || description.trim() === "") {
      errors.description = "Description is required";
    }
    if (price === undefined || price === null || price === "") {
      errors.price = "Price is required";
    }
    if (!category) {
      errors.category = "Category is required";
    }
    if (!req.file) {
      errors.image = "Product image is required";
    }
  }

  // Validasi price jika ada
  if (price !== undefined && price !== null && price !== "") {
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      errors.price = "Price must be a positive number";
    }
  }

  // Validasi stock jika ada
  if (stock !== undefined && stock !== null && stock !== "") {
    const stockNum = Number(stock);
    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      errors.stock = "Stock must be a non-negative integer";
    }
  }

  // Validasi category ID jika ada
  if (category && !isValidObjectId(category)) {
    errors.category = "Invalid category ID format";
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize dan convert types
  if (name) req.body.name = name.trim();
  if (description) req.body.description = description.trim();
  if (price !== undefined) req.body.price = Number(price);
  if (stock !== undefined) req.body.stock = Number(stock);
  next();
};

/**
 * Validasi untuk Create Transaction
 */
export const validateTransaction = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  let { purchasedItems, totalPayment, customerName, customerContact, customerAddress } = req.body;
  const errors: Record<string, string> = {};

  // Parse purchasedItems jika dalam bentuk string
  if (typeof purchasedItems === "string") {
    try {
      purchasedItems = JSON.parse(purchasedItems);
      req.body.purchasedItems = purchasedItems;
    } catch {
      errors.purchasedItems = "Invalid format for purchasedItems. Must be valid JSON array.";
    }
  }

  if (!req.file) {
    errors.paymentProof = "Payment proof image is required";
  }

  if (!purchasedItems || !Array.isArray(purchasedItems) || purchasedItems.length === 0) {
    errors.purchasedItems = "At least one purchased item is required";
  } else {
    // Validasi setiap item
    for (let i = 0; i < purchasedItems.length; i++) {
      const item = purchasedItems[i];
      if (!item.productId || !isValidObjectId(item.productId)) {
        errors[`purchasedItems[${i}].productId`] = "Valid product ID is required";
      }
      if (!item.qty || item.qty < 1 || !Number.isInteger(item.qty)) {
        errors[`purchasedItems[${i}].qty`] = "Quantity must be a positive integer";
      }
    }
  }

  if (totalPayment === undefined || totalPayment === null) {
    errors.totalPayment = "Total payment is required";
  } else {
    const total = Number(totalPayment);
    if (isNaN(total) || total <= 0) {
      errors.totalPayment = "Total payment must be a positive number";
    }
  }

  if (!customerName || typeof customerName !== "string" || customerName.trim() === "") {
    errors.customerName = "Customer name is required";
  }

  if (!customerContact || typeof customerContact !== "string" || customerContact.trim() === "") {
    errors.customerContact = "Customer contact is required";
  }

  if (!customerAddress || typeof customerAddress !== "string" || customerAddress.trim() === "") {
    errors.customerAddress = "Customer address is required";
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize
  req.body.totalPayment = Number(totalPayment);
  req.body.customerName = customerName.trim();
  req.body.customerContact = customerContact.trim();
  req.body.customerAddress = customerAddress.trim();
  next();
};

/**
 * Validasi untuk Update Transaction Status
 */
export const validateTransactionStatus = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { status } = req.body;
  const validStatuses = ["pending", "paid", "rejected"];

  if (!status) {
    throw ApiError.badRequest("Validation failed", { status: "Status is required" });
  }

  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest("Validation failed", {
      status: `Status must be one of: ${validStatuses.join(", ")}`,
    });
  }

  next();
};

/**
 * Validasi untuk Create/Update Bank
 */
export const validateBank = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { bankName, accountName, accountNumber } = req.body;
  const errors: Record<string, string> = {};
  const isUpdate = req.method === "PUT";

  if (!isUpdate) {
    if (!bankName || typeof bankName !== "string" || bankName.trim() === "") {
      errors.bankName = "Bank name is required";
    }
    if (!accountName || typeof accountName !== "string" || accountName.trim() === "") {
      errors.accountName = "Account name is required";
    }
    if (!accountNumber || typeof accountNumber !== "string" || accountNumber.trim() === "") {
      errors.accountNumber = "Account number is required";
    }
  }

  if (Object.keys(errors).length > 0) {
    throw ApiError.badRequest("Validation failed", errors);
  }

  // Sanitize
  if (bankName) req.body.bankName = bankName.trim();
  if (accountName) req.body.accountName = accountName.trim();
  if (accountNumber) req.body.accountNumber = accountNumber.trim();
  next();
};

/**
 * Validasi parameter ID (MongoDB ObjectId)
 */
export const validateParamId = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const id = req.params.id;

  // Pastikan id adalah string tunggal, bukan array
  const idString = Array.isArray(id) ? id[0] : id;

  if (!idString || !isValidObjectId(idString)) {
    throw ApiError.badRequest("Invalid ID format. Please provide a valid ID.");
  }

  next();
};
