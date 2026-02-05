import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { config } from "../config";
import mongoose from "mongoose";

/**
 * Global Error Handler Middleware
 * Menangani semua error yang dilempar di aplikasi
 * Memberikan response error yang konsisten dan aman
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error untuk debugging (di production, gunakan logging service)
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Record<string, string> | undefined;

  // Handle ApiError (custom error yang kita buat)
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle Mongoose Validation Error
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = {};
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
  }
  // Handle Mongoose CastError (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Handle MongoDB Duplicate Key Error
  else if (err.name === "MongoServerError" && (err as any).code === 11000) {
    statusCode = 409;
    const keyValue = (err as any).keyValue;
    const field = Object.keys(keyValue)[0];
    message = `Duplicate value for field: ${field}. The value '${keyValue[field]}' already exists.`;
  }
  // Handle JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
  }
  // Handle Multer Errors
  else if (err.name === "MulterError") {
    statusCode = 400;
    if ((err as any).code === "LIMIT_FILE_SIZE") {
      message = "File too large. Maximum size is 5MB.";
    } else {
      message = (err as any).message || "File upload error";
    }
  }
  // Handle SyntaxError (invalid JSON in request body)
  else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // Kirim response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};

/**
 * Middleware untuk menangani route yang tidak ditemukan
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
