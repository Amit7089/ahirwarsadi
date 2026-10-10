import express from "express";

import {
  getAdminDashboard,
  getAllUsers,
  getUserDetails,
  toggleUserBlock,
  toggleUserVerification,
  deleteUser,
  getAllReports,
  updateReportStatus,
  getAdminPayments,
} from "../controllers/admin.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";
import isAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  isAuthenticated,
  isAdmin,
  getAdminDashboard
);

router.get(
  "/users",
  isAuthenticated,
  isAdmin,
  getAllUsers
);

router.get(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  getUserDetails
);

router.patch(
  "/users/:id/block",
  isAuthenticated,
  isAdmin,
  toggleUserBlock
);

router.patch(
  "/users/:id/verify",
  isAuthenticated,
  isAdmin,
  toggleUserVerification
);

router.delete(
  "/users/:id",
  isAuthenticated,
  isAdmin,
  deleteUser
);

// Reports Management

router.get(
  "/reports",
  isAuthenticated,
  isAdmin,
  getAllReports
);

router.patch(
  "/reports/:id",
  isAuthenticated,
  isAdmin,
  updateReportStatus
);

router.get(
  "/payments",
  isAuthenticated,
  getAdminPayments
);

export default router;