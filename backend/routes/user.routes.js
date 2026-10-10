
import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Registration
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

export default router;
