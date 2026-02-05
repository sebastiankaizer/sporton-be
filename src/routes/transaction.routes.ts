import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  createTransaction,
  getTransactionById,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller";
import {
  validateTransaction,
  validateTransactionStatus,
  validateParamId,
} from "../middlewares/validator.middleware";

const router = Router();

/**
 * TRANSACTION ROUTES
 * Base Path: /api/transactions
 */

/**
 * @route   POST /api/transactions/checkout
 * @desc    Create new transaction (checkout) with payment proof upload
 * @access  Public
 */
router.post(
  "/checkout",
  upload.single("image"),
  validateTransaction,
  createTransaction
);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions (with optional status filter)
 * @access  Private (Admin)
 */
router.get("/", authenticate, getTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 * @access  Public (for customer order tracking)
 */
router.get("/:id", validateParamId, getTransactionById);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction status (pending, paid, rejected)
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  authenticate,
  validateParamId,
  upload.none(),
  validateTransactionStatus,
  updateTransaction
);

export default router;