import mongoose, { Schema, Document } from "mongoose";

export interface IPurchasedItem {
  productId: mongoose.Types.ObjectId;
  qty: number;
}

export interface ITransaction extends Document {
  paymentProof: string;
  status: "pending" | "paid" | "rejected";
  purchasedItems: IPurchasedItem[];
  totalPayment: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const PurchasedItemSchema: Schema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const TransactionSchema: Schema = new Schema(
  {
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
        validator: function (items: IPurchasedItem[]) {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for faster queries
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);