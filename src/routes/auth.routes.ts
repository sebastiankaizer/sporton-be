import { Router } from "express";
import { signin, initiateAdmin, getMe } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateSignIn, validateInitiateAdmin } from "../middlewares/validator.middleware";

const router = Router();

/**
 * AUTHENTICATION ROUTES
 * Base Path: /api/auth
 */

/**
 * @route   POST /api/auth/signin
 * @desc    Login user dan return JWT Token
 * @access  Public
 */
router.post("/signin", validateSignIn, signin);

/**
 * @route   POST /api/auth/initiate-admin-user
 * @desc    Setup admin pertama kali (Satu kali pakai)
 * @access  Public
 */
router.post("/initiate-admin-user", validateInitiateAdmin, initiateAdmin);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get("/me", authenticate, getMe);

export default router;