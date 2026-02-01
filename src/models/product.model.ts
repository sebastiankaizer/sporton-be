import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: mongoose.Types.ObjectId; // Relasi ke Kategori
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Product name is required"], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0
    },
    imageUrl: { 
      type: String, 
      required: [true, "Image URL is required"] 
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Menyambungkan ke model Category
      required: [true, "Category is required"]
    }
  },
  { 
    timestamps: true,
    versionKey: false 
  },
);

export default mongoose.model<IProduct>("Product", ProductSchema);