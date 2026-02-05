"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Custom Error Class untuk API
 * Digunakan untuk membedakan error yang dilempar secara sengaja (operational)
 * dari error sistem yang tidak terduga (programming errors)
 */
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, errors) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        // Menjaga prototype chain yang benar
        Object.setPrototypeOf(this, ApiError.prototype);
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Factory method untuk error umum
     */
    static badRequest(message, errors) {
        return new ApiError(400, message, true, errors);
    }
    static unauthorized(message = "Unauthorized access") {
        return new ApiError(401, message);
    }
    static forbidden(message = "Access forbidden") {
        return new ApiError(403, message);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }
    static conflict(message) {
        return new ApiError(409, message);
    }
    static internal(message = "Internal server error") {
        return new ApiError(500, message, false);
    }
}
exports.ApiError = ApiError;
