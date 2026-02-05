"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const bank_routes_1 = __importDefault(require("./routes/bank.routes"));
// Middlewares
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
// Config
const config_1 = require("./config");
/**
 * Express Application Setup
 */
const app = (0, express_1.default)();
/**
 * Security Middlewares
 */
// Helmet: Set various HTTP headers for security
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for static files
}));
// CORS: Enable Cross-Origin Resource Sharing
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// Rate Limiting: Protect against brute-force attacks
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimitWindowMs,
    max: config_1.config.rateLimitMaxRequests,
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
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
/**
 * Logging Middleware (only in development)
 */
if (config_1.config.nodeEnv === "development") {
    app.use((0, morgan_1.default)("dev"));
}
/**
 * Static Files
 */
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
/**
 * API Routes
 */
app.use("/api/auth", auth_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/transactions", transaction_routes_1.default);
app.use("/api/banks", bank_routes_1.default);
/**
 * Health Check Endpoint
 */
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Sporton Backend API is Running",
        version: "1.0.0",
        environment: config_1.config.nodeEnv,
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
app.use(errorHandler_middleware_1.notFoundHandler);
/**
 * Global Error Handler - Must be last middleware
 */
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
