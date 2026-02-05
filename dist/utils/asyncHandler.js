"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * Async Handler Wrapper
 * Membungkus async controller functions agar error otomatis diteruskan ke error handler
 * Menghilangkan kebutuhan try-catch berulang di setiap controller
 *
 * @param fn - Async function yang akan dibungkus
 * @returns Express RequestHandler yang menangani error secara otomatis
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
