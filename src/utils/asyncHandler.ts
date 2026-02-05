import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Async Handler Wrapper
 * Membungkus async controller functions agar error otomatis diteruskan ke error handler
 * Menghilangkan kebutuhan try-catch berulang di setiap controller
 * 
 * @param fn - Async function yang akan dibungkus
 * @returns Express RequestHandler yang menangani error secara otomatis
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
