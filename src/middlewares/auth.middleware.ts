import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

/**
 * Interface untuk JWT Payload
 */
export interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Interface untuk memperluas Express Request
 * Agar kita bisa menyimpan data user hasil decode JWT ke dalam objek req
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware untuk memvalidasi Token JWT pada route yang diproteksi
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Ambil token dari header Authorization
    const authHeader = req.header("Authorization");

    // 2. Cek apakah header Authorization ada dan menggunakan format 'Bearer <token>'
    if (!authHeader) {
      return next(ApiError.unauthorized("Access Denied: No token provided"));
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("Access Denied: Invalid token format. Use 'Bearer <token>'"));
    }

    // 3. Ekstrak token saja (menghapus kata 'Bearer ')
    const token = authHeader.slice(7).trim();

    if (!token) {
      return next(ApiError.unauthorized("Access Denied: Token is empty"));
    }

    // 4. Verifikasi token menggunakan JWT_SECRET
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    // 5. Jika valid, simpan hasil decode (payload) ke dalam req.user
    req.user = decoded;

    // 6. Lanjutkan ke fungsi/controller berikutnya
    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized("Invalid token. Please log in again."));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized("Your session has expired. Please log in again."));
    }
    // Pass other errors to error handler
    next(error);
  }
};

/**
 * Middleware opsional untuk route yang bisa diakses dengan atau tanpa auth
 * Jika ada token valid, user info akan diattach ke request
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token invalid, tapi tidak apa-apa karena ini optional
  }

  next();
};