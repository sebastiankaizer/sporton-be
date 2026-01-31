import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET as Secret | undefined;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

const JWT_EXPIRES_SECONDS = 60 * 60 * 24;

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body as {
      email?: unknown;
      password?: unknown;
    };

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: String(user._id), email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_SECONDS }
    );

    return res.status(200).json({
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const initiateAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password, name } = req.body as {
      email?: unknown;
      password?: unknown;
      name?: unknown;
    };

    if (
      !isNonEmptyString(email) ||
      !isNonEmptyString(password) ||
      !isNonEmptyString(name)
    ) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingCount = await User.estimatedDocumentCount();
    if (existingCount > 0) {
      return res.status(409).json({
        message:
          "Admin already initialized. Delete all users from database to re-initialize.",
      });
    }

    const created = await User.create({
      email: email.trim().toLowerCase(),
      password,
      name: name.trim(),
      role: "admin",
      isAdmin: true,
    });

    return res.status(201).json({
      message: "Admin user created successfully",
      user: {
        id: String(created._id),
        name: created.name,
        email: created.email,
        role: created.role,
        isAdmin: created.isAdmin,
      },
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error("Initiate admin error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
