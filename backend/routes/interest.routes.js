import express from "express";

import {
  sendInterest,
  getReceivedInterests,
  respondToInterest,
  getInterestStats,
} from "../controllers/interest.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

// Send interest
router.post(
  "/send",
  isAuthenticated,
  sendInterest
);

// Interest statistics
router.get(
  "/stats",
  isAuthenticated,
  getInterestStats
);

// Received interests
router.get(
  "/received",
  isAuthenticated,
  getReceivedInterests
);

// Accept / Reject interest
router.put(
  "/:interestId/respond",
  isAuthenticated,
  respondToInterest
);

export default router;