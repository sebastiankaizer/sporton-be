import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import { authenticate } from "./middlewares/auth.middleware";

const app: Application = express();

// --- Konfigurasi Middleware ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Biar folder uploads bisa diakses lewat link (buat nampilin gambar produk)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Registrasi Semua Route ---
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Cek kalau API nyala
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Aman, API Sporton sudah jalan.",
    version: "1.0.0"
  });
});

// Buat ngetes token doang
app.get("/test-middleware", authenticate, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Token valid, kamu punya akses!",
    user: (req as any).user
  });
});

// --- Handling Error & Route Ghoib ---

// Kalau user nembak route yang nggak ada
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `URL ${req.originalUrl} nggak ketemu.`
  });
});

// Jaring pengaman kalau ada error di server (Internal Server Error)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  console.error("Waduh, ada error nih:", err.message);
  
  res.status(status).json({
    success: false,
    message: err.message || "Terjadi kesalahan di server.",
    // Stack trace cuma muncul pas lagi development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;