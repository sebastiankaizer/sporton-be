"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const bank_controller_1 = require("../controllers/bank.controller");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const router = (0, express_1.Router)();
/**
 * BANK ROUTES
 * Base Path: /api/banks
 */
/**
 * @route   GET /api/banks
 * @desc    Get all bank accounts
 * @access  Public
 */
router.get("/", bank_controller_1.getBanks);
/**
 * @route   GET /api/banks/:id
 * @desc    Get single bank account by ID
 * @access  Public
 */
router.get("/:id", validator_middleware_1.validateParamId, bank_controller_1.getBankById);
/**
 * @route   POST /api/banks
 * @desc    Create new bank account
 * @access  Private (Admin)
 */
router.post("/", auth_middleware_1.authenticate, validator_middleware_1.validateBank, bank_controller_1.createBank);
/**
 * @route   PUT /api/banks/:id
 * @desc    Update bank account
 * @access  Private (Admin)
 */
router.put("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, validator_middleware_1.validateBank, bank_controller_1.updateBank);
/**
 * @route   DELETE /api/banks/:id
 * @desc    Delete bank account
 * @access  Private (Admin)
 */
router.delete("/:id", auth_middleware_1.authenticate, validator_middleware_1.validateParamId, bank_controller_1.deleteBank);
exports.default = router;
