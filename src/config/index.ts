import dotenv from "dotenv";

dotenv.config();

/**
 * Konfigurasi Terpusat untuk Aplikasi
 * Semua environment variables dan konstanta dikumpulkan di sini
 */
/**
 * Type definition untuk konfigurasi
 */
interface AppConfig {
  port: string;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  maxFileSize: number;
  allowedMimeTypes: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

export const config: AppConfig = {
  // Server Configuration
  port: process.env.PORT || "5001",
  nodeEnv: process.env.NODE_ENV || "development",

  // Database Configuration
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/sporton",

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || "Sporton123",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  // Upload Configuration
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],

  // Rate Limiting
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
};

/**
 * Validasi environment variables yang wajib ada
 */
export const validateEnv = (): void => {
  const requiredEnvVars = ["MONGO_URI"];
  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0 && config.nodeEnv === "production") {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }
};
