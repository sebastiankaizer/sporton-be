"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
/**
 * Server Startup
 */
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate environment variables
        (0, config_1.validateEnv)();
        // Connect to MongoDB
        console.log("🔄 Connecting to MongoDB...");
        yield mongoose_1.default.connect(config_1.config.mongoUri, {
            family: 4, // Use IPv4
            authSource: "admin",
            retryWrites: true,
        });
        console.log("✅ Connected to MongoDB successfully");
        // Start Express server
        const server = app_1.default.listen(config_1.config.port, () => {
            console.log(`🚀 Server is running on port ${config_1.config.port}`);
            console.log(`📍 Environment: ${config_1.config.nodeEnv}`);
            console.log(`🌐 API URL: http://localhost:${config_1.config.port}`);
        });
        // Graceful shutdown handlers
        const gracefulShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            server.close(() => __awaiter(void 0, void 0, void 0, function* () {
                console.log("🔒 HTTP server closed");
                try {
                    yield mongoose_1.default.connection.close();
                    console.log("🔒 MongoDB connection closed");
                    process.exit(0);
                }
                catch (error) {
                    console.error("Error during shutdown:", error);
                    process.exit(1);
                }
            }));
            // Force close after 10 seconds
            setTimeout(() => {
                console.error("⚠️ Could not close connections in time, forcefully shutting down");
                process.exit(1);
            }, 10000);
        });
        // Listen for termination signals
        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (reason) => {
            console.error("❌ Unhandled Rejection:", reason);
            // Don't exit in development for debugging
            if (config_1.config.nodeEnv === "production") {
                gracefulShutdown("unhandledRejection");
            }
        });
        // Handle uncaught exceptions
        process.on("uncaughtException", (error) => {
            console.error("❌ Uncaught Exception:", error);
            gracefulShutdown("uncaughtException");
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
});
// Start the server
startServer();
