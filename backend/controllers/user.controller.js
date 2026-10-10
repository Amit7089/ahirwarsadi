import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================================
// COOKIE OPTIONS
// ===================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ===================================
// REGISTER USER
// ===================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      gender,
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !gender
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error",
      });
    }

    // Clean input
    const cleanName = fullName.trim();
    const normalizedEmail =
      email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Validate name
    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name is too short",
      });
    }

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate phone
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must contain exactly 10 digits",
      });
    }

    // Password validation
    if (typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters",
      });
    }

    // Validate gender
    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: cleanPhone },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      fullName: cleanName,
      email: normalizedEmail,
      phone: cleanPhone,
      password: hashedPassword,
      gender,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    // MongoDB duplicate key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email or phone already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===================================
// LOGIN USER
// ===================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // Validate JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Check blocked account
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been blocked by admin. Please contact support.",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Secure HTTP-only cookie
    res.cookie(
      "token",
      token,
      cookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===================================
// LOGOUT USER
// ===================================

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie(
      "token",
      cookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(
      "Logout Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};