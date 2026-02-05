"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteUploadedFile = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../config");
/**
 * 1. Persiapan Folder Penyimpanan
 * Gunakan path.join agar folder 'uploads' selalu berada di root project
 */
const uploadDir = path_1.default.join(process.cwd(), "uploads");
// Buat folder uploads jika belum ada
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
/**
 * 2. Konfigurasi Penyimpanan (Disk Storage)
 */
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Generate unique filename: timestamp-randomNumber.extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
/**
 * 3. Filter Jenis File
 * Hanya menerima file gambar dengan mimetype yang diizinkan
 */
const fileFilter = (_req, file, cb) => {
    // Cek mimetype
    if (config_1.config.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type. Allowed types: ${config_1.config.allowedMimeTypes.join(", ")}`));
    }
};
/**
 * 4. Inisialisasi Multer dengan konfigurasi lengkap
 */
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: config_1.config.maxFileSize, // 5MB dari config
        files: 1, // Maksimal 1 file per request
    },
});
/**
 * Helper function untuk menghapus file yang sudah diupload
 * Berguna ketika operasi database gagal setelah file berhasil diupload
 */
const deleteUploadedFile = (filePath) => {
    if (filePath && fs_1.default.existsSync(filePath)) {
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        });
    }
};
exports.deleteUploadedFile = deleteUploadedFile;
/**
 * Helper function untuk mendapatkan URL publik dari file path
 */
const getFileUrl = (filePath, baseUrl) => {
    if (!filePath)
        return "";
    // Convert backslashes to forward slashes untuk URL
    const normalizedPath = filePath.replace(/\\/g, "/");
    // Extract filename from path
    const filename = path_1.default.basename(normalizedPath);
    return `${baseUrl}/uploads/${filename}`;
};
exports.getFileUrl = getFileUrl;
