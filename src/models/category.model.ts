import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Category name is required"], 
      unique: true, 
      trim: true
    },
    description: { 
      type: String, 
      required: [true, "Description is required"],
      trim: true
    },
    imageUrl: { 
      type: String, 
      required: [true, "Image URL is required"] 
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  },
);

// Hapus manual index name:1 di sini agar tidak duplicate warning
export default mongoose.model<ICategory>("Category", CategorySchema);