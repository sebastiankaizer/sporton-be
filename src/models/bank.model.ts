import mongoose, { Schema, Document } from "mongoose";

export interface IBank extends Document {
  bankName: string;
  accountName: string;
  accountNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const BankSchema: Schema = new Schema(
  {
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IBank>("Bank", BankSchema);