import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { config } from "../config";

/**
 * 1. Persiapan Folder Penyimpanan
 * Gunakan path.join agar folder 'uploads' selalu berada di root project
 */
const uploadDir = path.join(process.cwd(), "uploads");

// Buat folder uploads jika belum ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 2. Konfigurasi Penyimpanan (Disk Storage)
 */
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Generate unique filename: timestamp-randomNumber.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

/**
 * 3. Filter Jenis File
 * Hanya menerima file gambar dengan mimetype yang diizinkan
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  // Cek mimetype
  if (config.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${config.allowedMimeTypes.join(", ")}`));
  }
};

/**
 * 4. Inisialisasi Multer dengan konfigurasi lengkap
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize, // 5MB dari config
    files: 1, // Maksimal 1 file per request
  },
});

/**
 * Helper function untuk menghapus file yang sudah diupload
 * Berguna ketika operasi database gagal setelah file berhasil diupload
 */
export const deleteUploadedFile = (filePath: string): void => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    });
  }
};

/**
 * Helper function untuk mendapatkan URL publik dari file path
 */
export const getFileUrl = (filePath: string, baseUrl: string): string => {
  if (!filePath) return "";
  // Convert backslashes to forward slashes untuk URL
  const normalizedPath = filePath.replace(/\\/g, "/");
  // Extract filename from path
  const filename = path.basename(normalizedPath);
  return `${baseUrl}/uploads/${filename}`;
};