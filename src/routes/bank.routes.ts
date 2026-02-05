import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createBank,
  deleteBank,
  getBanks,
  getBankById,
  updateBank,
} from "../controllers/bank.controller";
import { validateBank, validateParamId } from "../middlewares/validator.middleware";

const router = Router();

/**
 * BANK ROUTES
 * Base Path: /api/banks
 */

/**
 * @route   GET /api/banks
 * @desc    Get all bank accounts
 * @access  Public
 */
router.get("/", getBanks);

/**
 * @route   GET /api/banks/:id
 * @desc    Get single bank account by ID
 * @access  Public
 */
router.get("/:id", validateParamId, getBankById);

/**
 * @route   POST /api/banks
 * @desc    Create new bank account
 * @access  Private (Admin)
 */
router.post("/", authenticate, validateBank, createBank);

/**
 * @route   PUT /api/banks/:id
 * @desc    Update bank account
 * @access  Private (Admin)
 */
router.put("/:id", authenticate, validateParamId, validateBank, updateBank);

/**
 * @route   DELETE /api/banks/:id
 * @desc    Delete bank account
 * @access  Private (Admin)
 */
router.delete("/:id", authenticate, validateParamId, deleteBank);

export default router;