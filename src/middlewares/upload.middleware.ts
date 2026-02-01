import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * 1. Persiapan Folder Penyimpanan
 * Gunakan path.join agar folder 'uploads' selalu berada di root project
 */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 2. Konfigurasi Penyimpanan (Disk Storage)
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * 3. Filter Jenis File
 */
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed!") as any);
  }
};

/**
 * 4. Inisialisasi Multer
 */
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
});