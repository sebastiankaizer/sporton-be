import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";

// Routes
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import transactionRoutes from "./routes/transaction.routes";
import bankRoutes from "./routes/bank.routes";

// Middlewares
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware";

// Config
import { config } from "./config";

/**
 * Express Application Setup
 */
const app: Application = express();

/**
 * Security Middlewares
 */

// Helmet: Set various HTTP headers for security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for static files
}));

// CORS: Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Rate Limiting: Protect against brute-force attacks
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes only
app.use("/api", limiter);

/**
 * Body Parsing Middlewares
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Logging Middleware (only in development)
 */
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

/**
 * Static Files
 */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/banks", bankRoutes);

/**
 * Health Check Endpoint
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Sporton Backend API is Running",
    version: "1.0.0",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Documentation Endpoint
 */
app.get("/api", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Sporton API",
    endpoints: {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      transactions: "/api/transactions",
      banks: "/api/banks",
    },
    documentation: "See Postman collection for detailed API documentation",
  });
});

/**
 * 404 Handler - Handle undefined routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler - Must be last middleware
 */
app.use(errorHandler);

export default app;