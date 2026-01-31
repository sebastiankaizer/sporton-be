import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isAdmin: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidate: string
) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
