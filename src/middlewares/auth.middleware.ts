import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

/**
 * Interface untuk memperluas Express Request
 * Agar kita bisa menyimpan data user hasil decode JWT ke dalam objek req
 */
export interface AuthRequest extends Request {
  user?: any; // Anda bisa mengganti 'any' dengan interface User jika sudah ada
}

/**
 * Middleware untuk memvalidasi Token JWT pada route yang diproteksi
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // 1. Ambil token dari header Authorization
  const authHeader = req.header("Authorization");

  // 2. Cek apakah header Authorization ada dan menggunakan format 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ 
      success: false,
      message: "Access Denied: No token provided or invalid format. Please use 'Bearer <token>'" 
    });
    return;
  }

  // 3. Ekstrak token saja (menghapus kata 'Bearer ')
  const token = authHeader.replace("Bearer ", "");

  try {
    // 4. Verifikasi token menggunakan JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);

    // 5. Jika valid, simpan hasil decode (payload) ke dalam req.user
    req.user = decoded;

    // 6. Lanjutkan ke fungsi/controller berikutnya
    next();
  } catch (error) {
    // Log error untuk keperluan internal debugging
    console.error("JWT Verification Error:", error);

    // 7. Kirim response jika token kadaluwarsa atau tidak valid
    res.status(401).json({ 
      success: false,
      message: "Authentication Failed: Your session has expired or the token is invalid" 
    });
  }
};