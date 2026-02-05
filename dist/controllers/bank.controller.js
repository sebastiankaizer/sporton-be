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
exports.deleteBank = exports.updateBank = exports.getBankById = exports.getBanks = exports.createBank = void 0;
const bank_model_1 = __importDefault(require("../models/bank.model"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
/**
 * @description Create a new bank account
 * @route POST /api/banks
 * @access Private (Admin)
 */
exports.createBank = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bankName, accountName, accountNumber } = req.body;
    // Cek duplikasi nomor rekening
    const existingBank = yield bank_model_1.default.findOne({ accountNumber });
    if (existingBank) {
        throw ApiError_1.ApiError.conflict(`Bank account with number '${accountNumber}' already exists`);
    }
    const bank = new bank_model_1.default({
        bankName,
        accountName,
        accountNumber,
    });
    yield bank.save();
    response_1.ResponseHandler.created(res, "Bank account created successfully", bank);
}));
/**
 * @description Get all bank accounts
 * @route GET /api/banks
 * @access Public
 */
exports.getBanks = (0, asyncHandler_1.asyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const banks = yield bank_model_1.default.find().sort({ createdAt: -1 });
    response_1.ResponseHandler.ok(res, "Bank accounts fetched successfully", banks, banks.length);
}));
/**
 * @description Get single bank account by ID
 * @route GET /api/banks/:id
 * @access Public
 */
exports.getBankById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bank = yield bank_model_1.default.findById(id);
    if (!bank) {
        throw ApiError_1.ApiError.notFound(`Bank account with ID '${id}' not found`);
    }
    response_1.ResponseHandler.ok(res, "Bank account found", bank);
}));
/**
 * @description Update bank account
 * @route PUT /api/banks/:id
 * @access Private (Admin)
 */
exports.updateBank = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { accountNumber } = req.body;
    // Cek duplikasi nomor rekening jika diubah
    if (accountNumber) {
        const existingBank = yield bank_model_1.default.findOne({
            _id: { $ne: id },
            accountNumber,
        });
        if (existingBank) {
            throw ApiError_1.ApiError.conflict(`Bank account with number '${accountNumber}' already exists`);
        }
    }
    const bank = yield bank_model_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bank) {
        throw ApiError_1.ApiError.notFound("Bank account not found, update failed");
    }
    response_1.ResponseHandler.ok(res, "Bank account updated successfully", bank);
}));
/**
 * @description Delete bank account
 * @route DELETE /api/banks/:id
 * @access Private (Admin)
 */
exports.deleteBank = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const bank = yield bank_model_1.default.findByIdAndDelete(id);
    if (!bank) {
        throw ApiError_1.ApiError.notFound("Bank account not found, deletion failed");
    }
    response_1.ResponseHandler.ok(res, "Bank account deleted successfully");
}));
