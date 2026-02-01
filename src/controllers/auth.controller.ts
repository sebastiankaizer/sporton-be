import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

/**
 * @description Handle User Sign In
 * @route POST /api/auth/signin
 */
export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        message: "Please provide both email and password" 
      });
      return;
    }

    /**
     * PERBAIKAN DI SINI:
     * Karena di model user.password kita set { select: false }, 
     * kita harus memanggilnya secara manual menggunakan .select("+password")
     * agar bcrypt bisa membandingkan teks dengan hash-nya.
     */
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: "Invalid Credentials" 
      });
      return;
    }

    // Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.status(401).json({ 
        success: false, 
        message: "Invalid Credentials" 
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signin Error Details: ", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
};

/**
 * @description Initialize First Admin User (Hanya bisa dilakukan jika DB kosong)
 * @route POST /api/auth/initiate-admin
 */
export const initiateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ 
        success: false,
        message: "All fields (email, password, name) must be filled" 
      });
      return;
    }

    const userCount = await User.countDocuments({});
    
    if (userCount > 0) {
      res.status(400).json({
        success: false,
        message: "Initialization Denied: System already has an admin user. Delete manually from DB if you wish to reset.",
      });
      return;
    }

    /**
     * CATATAN: 
     * Kamu sebenarnya tidak perlu melakukan hashing manual di sini 
     * karena kita sudah punya Pre-save hook di user.model.ts yang 
     * otomatis meng-hash password sebelum disimpan ke database.
     */
    const adminUser = new User({
      email: email,
      password: password, // Pre-save hook di model akan menghash ini otomatis
      name: name,
    });

    await adminUser.save();

    res.status(201).json({ 
      success: true,
      message: "First Admin user created successfully! Please proceed to login." 
    });

  } catch (error) {
    console.error("Initiate Admin Error Details: ", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
};