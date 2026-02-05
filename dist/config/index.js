"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
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
const validateEnv = () => {
    const requiredEnvVars = ["MONGO_URI"];
    const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingVars.length > 0 && exports.config.nodeEnv === "production") {
        throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
};
exports.validateEnv = validateEnv;
