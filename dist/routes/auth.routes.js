"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = (0, express_1.Router)();
/**
 * AUTHENTICATION ROUTES
 * Base Path: /api/auth
 */
/**
 * @route   POST /api/auth/signin
 * @desc    Login user dan return JWT Token
 * @access  Public
 */
router.post("/signin", validator_middleware_1.validateSignIn, auth_controller_1.signin);
/**
 * @route   POST /api/auth/initiate-admin-user
 * @desc    Setup admin pertama kali (Satu kali pakai)
 * @access  Public
 */
router.post("/initiate-admin-user", validator_middleware_1.validateInitiateAdmin, auth_controller_1.initiateAdmin);
/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user profile
 * @access  Private
 */
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.getMe);
exports.default = router;
