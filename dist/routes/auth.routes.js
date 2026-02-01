"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
// Kita asumsikan Anda akan membuat middleware validasi nantinya
// import { validateSignin, validateAdmin } from "../middlewares/validator.middleware";
const router = (0, express_1.Router)();
/**
 * AUTHENTICATION ROUTES
 * Base Path: /api/auth
 */
// @route   POST /api/auth/signin
// @desc    Login user dan return JWT Token
router.post("/signin", 
// validateSignin, // (Improvement: Validasi input sebelum ke controller)
auth_controller_1.signin);
// @route   POST /api/auth/initiate-admin-user
// @desc    Setup admin pertama kali (Satu kali pakai)
router.post("/initiate-admin-user", 
// validateAdmin, // (Improvement: Memastikan data admin valid)
auth_controller_1.initiateAdmin);
exports.default = router;
