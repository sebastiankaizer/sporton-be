import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { config } from "../config";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseHandler } from "../utils/response";
import { ApiError } from "../utils/ApiError";

/**
 * @description Handle User Sign In
 * @route POST /api/auth/signin
 * @access Public
 */
export const signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Cari user berdasarkan email (dengan menyertakan password yang di-exclude by default)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  // Bandingkan password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
  );

  ResponseHandler.ok(res, "Authentication successful", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * @description Initialize first admin user (one-time setup)
 * @route POST /api/auth/initiate-admin-user
 * @access Public (hanya berfungsi jika belum ada user)
 */
export const initiateAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  // Cek apakah sudah ada user di database
  const userCount = await User.countDocuments({});

  if (userCount > 0) {
    throw ApiError.conflict(
      "Initialization Denied: System already has an admin user. Delete manually from DB if you wish to reset."
    );
  }

  // Buat admin user baru
  const adminUser = new User({
    email,
    password,
    name,
  });

  await adminUser.save();

  ResponseHandler.created(res, "First Admin user created successfully! Please proceed to login.");
});

/**
 * @description Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // req.user sudah di-set oleh auth middleware
  const user = await User.findById((req as any).user?.id).select("-password");

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  ResponseHandler.ok(res, "User profile retrieved successfully", user);
});