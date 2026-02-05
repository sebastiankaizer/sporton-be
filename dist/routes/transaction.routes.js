"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const transaction_controller_1 = require("../controllers/transaction.controller");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = (0, express_1.Router)();
/**
 * TRANSACTION ROUTES
 * Base Path: /api/transactions
 */
/**
 * @route   POST /api/transactions/checkout
 * @desc    Create new transaction (checkout) with payment proof upload
 * @access  Public
 */
router.post("/checkout", upload_middleware_1.upload.single("image"), validator_middleware_1.validateTransaction, transaction_controller_1.createTransaction);
/**
 * @route   GET /api/transactions
 * @desc    Get all transactions (with optional status filter)
 * @access  Private (Admin)
 */
router.get("/", auth_middleware_1.authenticate, transaction_controller_1.getTransactions);
/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 * @access  Public (for customer order tracking)
 */
router.get("/:id", validator_middleware_1.validateParamId, transaction_controller_1.getTransactionById);
/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction status (pending, paid, rejected)
 * @access  Private (Admin)
 */
router.put("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, upload_middleware_1.upload.none(), validator_middleware_1.validateTransactionStatus, transaction_controller_1.updateTransaction);
exports.default = router;
