import express from "express";

import {
  getMembershipPlans,
  getMyMembership,
  createMembershipOrder,
  verifyMembershipPayment,
  getMyPaymentHistory,
} from "../controllers/membership.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: Get All Plans
router.get("/plans", getMembershipPlans);

// Logged-in User: Get My Membership
router.get("/my", isAuthenticated, getMyMembership);

// Create Payment Order
router.post("/create-order", isAuthenticated, createMembershipOrder);

// Verify Payment
router.post("/verify-payment", isAuthenticated, verifyMembershipPayment);
router.get("/payments", isAuthenticated, getMyPaymentHistory);

export default router;