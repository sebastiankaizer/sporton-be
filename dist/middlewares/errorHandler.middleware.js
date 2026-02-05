"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const config_1 = require("../config");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Global Error Handler Middleware
 * Menangani semua error yang dilempar di aplikasi
 * Memberikan response error yang konsisten dan aman
 */
const errorHandler = (err, req, res, _next) => {
    // Log error untuk debugging (di production, gunakan logging service)
    console.error("Error:", {
        name: err.name,
        message: err.message,
        stack: config_1.config.nodeEnv === "development" ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });
    // Default values
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors;
    // Handle ApiError (custom error yang kita buat)
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    // Handle Mongoose Validation Error
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        message = "Validation Error";
        errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
    }
    // Handle Mongoose CastError (invalid ObjectId)
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    // Handle MongoDB Duplicate Key Error
    else if (err.name === "MongoServerError" && err.code === 11000) {
        statusCode = 409;
        const keyValue = err.keyValue;
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
        if (err.code === "LIMIT_FILE_SIZE") {
            message = "File too large. Maximum size is 5MB.";
        }
        else {
            message = err.message || "File upload error";
        }
    }
    // Handle SyntaxError (invalid JSON in request body)
    else if (err instanceof SyntaxError && "body" in err) {
        statusCode = 400;
        message = "Invalid JSON in request body";
    }
    // Kirim response
    res.status(statusCode).json(Object.assign(Object.assign({ success: false, message }, (errors && { errors })), (config_1.config.nodeEnv === "development" && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
/**
 * Middleware untuk menangani route yang tidak ditemukan
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
