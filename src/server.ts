import mongoose from "mongoose";
import app from "./app";
import { config, validateEnv } from "./config";

/**
 * Server Startup
 */
const startServer = async (): Promise<void> => {
  try {
    // Validate environment variables
    validateEnv();

    // Connect to MongoDB
    console.log("🔄 Connecting to MongoDB...");
    
    await mongoose.connect(config.mongoUri, {
      family: 4, // Use IPv4
      authSource: "admin",
      retryWrites: true,
    });

    console.log("✅ Connected to MongoDB successfully");

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 API URL: http://localhost:${config.port}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("🔒 HTTP server closed");

        try {
          await mongoose.connection.close();
          console.log("🔒 MongoDB connection closed");
          process.exit(0);
        } catch (error) {
          console.error("Error during shutdown:", error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error("⚠️ Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason: Error) => {
      console.error("❌ Unhandled Rejection:", reason);
      // Don't exit in development for debugging
      if (config.nodeEnv === "production") {
        gracefulShutdown("unhandledRejection");
      }
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error: Error) => {
      console.error("❌ Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();