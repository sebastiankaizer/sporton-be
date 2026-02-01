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
exports.initiateAdmin = exports.signin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";
/**
 * @description Handle User Sign In
 * @route POST /api/auth/signin
 */
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide both email and password"
            });
            return;
        }
        /**
         * PERBAIKAN DI SINI:
         * Karena di model user.password kita set { select: false },
         * kita harus memanggilnya secara manual menggunakan .select("+password")
         * agar bcrypt bisa membandingkan teks dengan hash-nya.
         */
        const user = yield user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
            return;
        }
        // Bandingkan password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({
            success: true,
            message: "Authentication successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Signin Error Details: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.signin = signin;
/**
 * @description Initialize First Admin User (Hanya bisa dilakukan jika DB kosong)
 * @route POST /api/auth/initiate-admin
 */
const initiateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                message: "All fields (email, password, name) must be filled"
            });
            return;
        }
        const userCount = yield user_model_1.default.countDocuments({});
        if (userCount > 0) {
            res.status(400).json({
                success: false,
                message: "Initialization Denied: System already has an admin user. Delete manually from DB if you wish to reset.",
            });
            return;
        }
        /**
         * CATATAN:
         * Kamu sebenarnya tidak perlu melakukan hashing manual di sini
         * karena kita sudah punya Pre-save hook di user.model.ts yang
         * otomatis meng-hash password sebelum disimpan ke database.
         */
        const adminUser = new user_model_1.default({
            email: email,
            password: password, // Pre-save hook di model akan menghash ini otomatis
            name: name,
        });
        yield adminUser.save();
        res.status(201).json({
            success: true,
            message: "First Admin user created successfully! Please proceed to login."
        });
    }
    catch (error) {
        console.error("Initiate Admin Error Details: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.initiateAdmin = initiateAdmin;
