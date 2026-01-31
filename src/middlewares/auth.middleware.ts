import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret | undefined = process.env.JWT_SECRET as
  | Secret
  | undefined;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export type AuthUser = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const userId = typeof decoded.sub === "string" ? decoded.sub : undefined;
    const email = typeof decoded.email === "string" ? decoded.email : undefined;

    if (!userId || !email) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: userId, email };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
