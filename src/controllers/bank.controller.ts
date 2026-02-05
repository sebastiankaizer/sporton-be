import { Request, Response } from "express";
import Bank from "../models/bank.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ResponseHandler } from "../utils/response";
import { ApiError } from "../utils/ApiError";

/**
 * @description Create a new bank account
 * @route POST /api/banks
 * @access Private (Admin)
 */
export const createBank = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { bankName, accountName, accountNumber } = req.body;

  // Cek duplikasi nomor rekening
  const existingBank = await Bank.findOne({ accountNumber });
  if (existingBank) {
    throw ApiError.conflict(`Bank account with number '${accountNumber}' already exists`);
  }

  const bank = new Bank({
    bankName,
    accountName,
    accountNumber,
  });

  await bank.save();

  ResponseHandler.created(res, "Bank account created successfully", bank);
});

/**
 * @description Get all bank accounts
 * @route GET /api/banks
 * @access Public
 */
export const getBanks = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const banks = await Bank.find().sort({ createdAt: -1 });

  ResponseHandler.ok(res, "Bank accounts fetched successfully", banks, banks.length);
});

/**
 * @description Get single bank account by ID
 * @route GET /api/banks/:id
 * @access Public
 */
export const getBankById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const bank = await Bank.findById(id);

  if (!bank) {
    throw ApiError.notFound(`Bank account with ID '${id}' not found`);
  }

  ResponseHandler.ok(res, "Bank account found", bank);
});

/**
 * @description Update bank account
 * @route PUT /api/banks/:id
 * @access Private (Admin)
 */
export const updateBank = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { accountNumber } = req.body;

  // Cek duplikasi nomor rekening jika diubah
  if (accountNumber) {
    const existingBank = await Bank.findOne({
      _id: { $ne: id as string },
      accountNumber,
    });
    if (existingBank) {
      throw ApiError.conflict(`Bank account with number '${accountNumber}' already exists`);
    }
  }

  const bank = await Bank.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bank) {
    throw ApiError.notFound("Bank account not found, update failed");
  }

  ResponseHandler.ok(res, "Bank account updated successfully", bank);
});

/**
 * @description Delete bank account
 * @route DELETE /api/banks/:id
 * @access Private (Admin)
 */
export const deleteBank = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const bank = await Bank.findByIdAndDelete(id);

  if (!bank) {
    throw ApiError.notFound("Bank account not found, deletion failed");
  }

  ResponseHandler.ok(res, "Bank account deleted successfully");
});