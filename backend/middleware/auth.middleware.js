import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  try {
    // JWT secret must exist
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // Get token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded user ID
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Check user
    const user = await User.findById(decoded.userId).select(
      "_id isBlocked"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Blocked users cannot access protected APIs
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by admin",
      });
    }

    // Attach authenticated user ID
    req.userId = user._id.toString();

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    console.error("Authentication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication server error",
    });
  }
};

export default isAuthenticated;