import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { randomUUID } from "crypto";

import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

const app = express();

app.set("trust proxy", 1);

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"]?.toString() || randomUUID();
  res.setHeader("x-request-id", requestId);
  req.requestId = requestId;
  next();
});

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
  })
);

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS_NOT_ALLOWED"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "Sporton Backend API",
    requestId: req.requestId,
  });
});

app.use("/api/auth", authRoutes);

app.get("/test-middleware", authenticate, (req: Request, res: Response) => {
  res.status(200).json({
    message: "Authorized",
    user: req.user ?? null,
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ message: "CORS blocked" });
  }

  const statusCode = Number(err?.statusCode) || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(statusCode).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err?.message || "Internal Server Error",
  });
});

export default app;
