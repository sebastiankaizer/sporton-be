import { Request, Response } from "express";
import mongoose from "mongoose";
import Transaction from "../models/transaction.model";
import Product from "../models/product.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseHandler } from "../utils/response";
import { ApiError } from "../utils/ApiError";

/**
 * @description Create a new transaction (checkout)
 * @route POST /api/transactions/checkout
 * @access Public
 */
export const createTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { purchasedItems, totalPayment, customerName, customerContact, customerAddress } = req.body;

  // Validasi ketersediaan stok untuk semua item
  for (const item of purchasedItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw ApiError.badRequest(`Product with ID '${item.productId}' not found`);
    }
    if (product.stock < item.qty) {
      throw ApiError.badRequest(
        `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.qty}`
      );
    }
  }

  const transactionData = {
    purchasedItems,
    totalPayment,
    customerName,
    customerContact,
    customerAddress,
    paymentProof: req.file?.path,
    status: "pending" as const, // Always force status to pending on creation
  };

  const transaction = new Transaction(transactionData);
  await transaction.save();

  // Populate product details untuk response
  await transaction.populate("purchasedItems.productId", "name price imageUrl");

  ResponseHandler.created(res, "Transaction created successfully. Awaiting payment confirmation.", transaction);
});

/**
 * @description Get all transactions
 * @route GET /api/transactions
 * @query status - Filter by status (pending, paid, rejected)
 * @access Private (Admin)
 */
export const getTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;

  const query: Record<string, unknown> = {};
  if (status && ["pending", "paid", "rejected"].includes(status as string)) {
    query.status = status;
  }

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .populate("purchasedItems.productId", "name price imageUrl");

  ResponseHandler.ok(res, "Transactions fetched successfully", transactions, transactions.length);
});

/**
 * @description Get single transaction by ID
 * @route GET /api/transactions/:id
 * @access Public (untuk customer tracking)
 */
export const getTransactionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id).populate("purchasedItems.productId");

  if (!transaction) {
    throw ApiError.notFound(`Transaction with ID '${id}' not found`);
  }

  ResponseHandler.ok(res, "Transaction found", transaction);
});

/**
 * @description Update transaction status
 * @route PUT /api/transactions/:id
 * @access Private (Admin)
 * 
 * IMPORTANT: Menggunakan MongoDB Transaction untuk memastikan konsistensi data
 * saat memperbarui stok produk ketika status berubah menjadi "paid"
 */
export const updateTransaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const existingTransaction = await Transaction.findById(id);
  if (!existingTransaction) {
    throw ApiError.notFound("Transaction not found");
  }

  // Prevent status changes from paid/rejected back to pending
  if (existingTransaction.status !== "pending" && status === "pending") {
    throw ApiError.badRequest("Cannot revert transaction status back to pending");
  }

  // Prevent duplicate stock reduction
  if (existingTransaction.status === "paid" && status === "paid") {
    throw ApiError.badRequest("Transaction is already marked as paid");
  }

  // Jika status berubah menjadi "paid", kurangi stok dengan transaction
  if (status === "paid" && existingTransaction.status !== "paid") {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Validasi dan kurangi stok untuk setiap item
        for (const item of existingTransaction.purchasedItems) {
          const product = await Product.findById(item.productId).session(session);
          
          if (!product) {
            throw ApiError.badRequest(`Product with ID '${item.productId}' no longer exists`);
          }
          
          if (product.stock < item.qty) {
            throw ApiError.badRequest(
              `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Required: ${item.qty}`
            );
          }

          await Product.findByIdAndUpdate(
            item.productId,
            { $inc: { stock: -item.qty } },
            { session }
          );
        }

        // Update status transaksi
        await Transaction.findByIdAndUpdate(
          id,
          { status },
          { session }
        );
      });

      await session.endSession();
    } catch (error) {
      await session.endSession();
      throw error;
    }
  } else {
    // Untuk status selain "paid", update langsung
    await Transaction.findByIdAndUpdate(id, { status });
  }

  // Ambil transaksi yang sudah diupdate untuk response
  const updatedTransaction = await Transaction.findById(id)
    .populate("purchasedItems.productId", "name price imageUrl stock");

  ResponseHandler.ok(res, `Transaction status updated to '${status}'`, updatedTransaction);
});