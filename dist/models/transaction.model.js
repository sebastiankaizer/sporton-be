"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PurchasedItemSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    qty: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
}, { _id: false });
const TransactionSchema = new mongoose_1.Schema({
    paymentProof: {
        type: String,
        required: [true, "Payment proof is required"],
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "paid", "rejected"],
            message: "Status must be one of: pending, paid, rejected",
        },
        default: "pending",
        required: true,
    },
    purchasedItems: {
        type: [PurchasedItemSchema],
        required: [true, "Purchased items are required"],
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: "At least one purchased item is required",
        },
    },
    totalPayment: {
        type: Number,
        required: [true, "Total payment is required"],
        min: [0, "Total payment cannot be negative"],
    },
    customerName: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
    },
    customerContact: {
        type: String,
        required: [true, "Customer contact is required"],
        trim: true,
    },
    customerAddress: {
        type: String,
        required: [true, "Customer address is required"],
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Index for faster queries
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model("Transaction", TransactionSchema);
