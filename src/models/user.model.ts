import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, // Ini sudah otomatis membuat index unik
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false 
    },
  },
  { 
    timestamps: true,
    versionKey: false 
  },
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Hapus manual index email:1 di sini agar tidak duplicate warning
export default mongoose.model<IUser>("User", UserSchema);