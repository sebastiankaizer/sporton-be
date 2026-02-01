import { Router } from "express";
import { signin, initiateAdmin } from "../controllers/auth.controller";
// Kita asumsikan Anda akan membuat middleware validasi nantinya
// import { validateSignin, validateAdmin } from "../middlewares/validator.middleware";

const router = Router();

/**
 * AUTHENTICATION ROUTES
 * Base Path: /api/auth
 */

// @route   POST /api/auth/signin
// @desc    Login user dan return JWT Token
router.post(
  "/signin", 
  // validateSignin, // (Improvement: Validasi input sebelum ke controller)
  signin
);

// @route   POST /api/auth/initiate-admin-user
// @desc    Setup admin pertama kali (Satu kali pakai)
router.post(
  "/initiate-admin-user", 
  // validateAdmin, // (Improvement: Memastikan data admin valid)
  initiateAdmin
);

export default router;