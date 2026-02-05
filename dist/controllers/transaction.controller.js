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
exports.updateTransaction = exports.getTransactionById = exports.getTransactions = exports.createTransaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const ApiError_1 = require("../utils/ApiError");
/**
 * @description Create a new transaction (checkout)
 * @route POST /api/transactions/checkout
 * @access Public
 */
exports.createTransaction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { purchasedItems, totalPayment, customerName, customerContact, customerAddress } = req.body;
    // Validasi ketersediaan stok untuk semua item
    for (const item of purchasedItems) {
        const product = yield product_model_1.default.findById(item.productId);
        if (!product) {
            throw ApiError_1.ApiError.badRequest(`Product with ID '${item.productId}' not found`);
        }
        if (product.stock < item.qty) {
            throw ApiError_1.ApiError.badRequest(`Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.qty}`);
        }
    }
    const transactionData = {
        purchasedItems,
        totalPayment,
        customerName,
        customerContact,
        customerAddress,
        paymentProof: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
        status: "pending", // Always force status to pending on creation
    };
    const transaction = new transaction_model_1.default(transactionData);
    yield transaction.save();
    // Populate product details untuk response
    yield transaction.populate("purchasedItems.productId", "name price imageUrl");
    response_1.ResponseHandler.created(res, "Transaction created successfully. Awaiting payment confirmation.", transaction);
}));
/**
 * @description Get all transactions
 * @route GET /api/transactions
 * @query status - Filter by status (pending, paid, rejected)
 * @access Private (Admin)
 */
exports.getTransactions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    const query = {};
    if (status && ["pending", "paid", "rejected"].includes(status)) {
        query.status = status;
    }
    const transactions = yield transaction_model_1.default.find(query)
        .sort({ createdAt: -1 })
        .populate("purchasedItems.productId", "name price imageUrl");
    response_1.ResponseHandler.ok(res, "Transactions fetched successfully", transactions, transactions.length);
}));
/**
 * @description Get single transaction by ID
 * @route GET /api/transactions/:id
 * @access Public (untuk customer tracking)
 */
exports.getTransactionById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const transaction = yield transaction_model_1.default.findById(id).populate("purchasedItems.productId");
    if (!transaction) {
        throw ApiError_1.ApiError.notFound(`Transaction with ID '${id}' not found`);
    }
    response_1.ResponseHandler.ok(res, "Transaction found", transaction);
}));
/**
 * @description Update transaction status
 * @route PUT /api/transactions/:id
 * @access Private (Admin)
 *
 * IMPORTANT: Menggunakan MongoDB Transaction untuk memastikan konsistensi data
 * saat memperbarui stok produk ketika status berubah menjadi "paid"
 */
exports.updateTransaction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const existingTransaction = yield transaction_model_1.default.findById(id);
    if (!existingTransaction) {
        throw ApiError_1.ApiError.notFound("Transaction not found");
    }
    // Prevent status changes from paid/rejected back to pending
    if (existingTransaction.status !== "pending" && status === "pending") {
        throw ApiError_1.ApiError.badRequest("Cannot revert transaction status back to pending");
    }
    // Prevent duplicate stock reduction
    if (existingTransaction.status === "paid" && status === "paid") {
        throw ApiError_1.ApiError.badRequest("Transaction is already marked as paid");
    }
    // Jika status berubah menjadi "paid", kurangi stok dengan transaction
    if (status === "paid" && existingTransaction.status !== "paid") {
        const session = yield mongoose_1.default.startSession();
        try {
            yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
                // Validasi dan kurangi stok untuk setiap item
                for (const item of existingTransaction.purchasedItems) {
                    const product = yield product_model_1.default.findById(item.productId).session(session);
                    if (!product) {
                        throw ApiError_1.ApiError.badRequest(`Product with ID '${item.productId}' no longer exists`);
                    }
                    if (product.stock < item.qty) {
                        throw ApiError_1.ApiError.badRequest(`Insufficient stock for product '${product.name}'. Available: ${product.stock}, Required: ${item.qty}`);
                    }
                    yield product_model_1.default.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } }, { session });
                }
                // Update status transaksi
                yield transaction_model_1.default.findByIdAndUpdate(id, { status }, { session });
            }));
            yield session.endSession();
        }
        catch (error) {
            yield session.endSession();
            throw error;
        }
    }
    else {
        // Untuk status selain "paid", update langsung
        yield transaction_model_1.default.findByIdAndUpdate(id, { status });
    }
    // Ambil transaksi yang sudah diupdate untuk response
    const updatedTransaction = yield transaction_model_1.default.findById(id)
        .populate("purchasedItems.productId", "name price imageUrl stock");
    response_1.ResponseHandler.ok(res, `Transaction status updated to '${status}'`, updatedTransaction);
}));
