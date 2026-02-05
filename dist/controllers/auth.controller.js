"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.initiateAdmin = exports.signin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = require("../config");
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
/**
 * @description Handle User Sign In
 * @route POST /api/auth/signin
 * @access Public
 */
exports.signin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Cari user berdasarkan email (dengan menyertakan password yang di-exclude by default)
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    // Bandingkan password
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw ApiError_1.ApiError.unauthorized("Invalid email or password");
    }
    // Generate JWT Token
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
    response_1.ResponseHandler.ok(res, "Authentication successful", {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
}));
/**
 * @description Initialize first admin user (one-time setup)
 * @route POST /api/auth/initiate-admin-user
 * @access Public (hanya berfungsi jika belum ada user)
 */
exports.initiateAdmin = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    // Cek apakah sudah ada user di database
    const userCount = yield user_model_1.default.countDocuments({});
    if (userCount > 0) {
        throw ApiError_1.ApiError.conflict("Initialization Denied: System already has an admin user. Delete manually from DB if you wish to reset.");
    }
    // Buat admin user baru
    const adminUser = new user_model_1.default({
        email,
        password,
        name,
    });
    yield adminUser.save();
    response_1.ResponseHandler.created(res, "First Admin user created successfully! Please proceed to login.");
}));
/**
 * @description Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // req.user sudah di-set oleh auth middleware
    const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
    if (!user) {
        throw ApiError_1.ApiError.notFound("User not found");
    }
    response_1.ResponseHandler.ok(res, "User profile retrieved successfully", user);
}));
