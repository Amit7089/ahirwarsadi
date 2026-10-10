import express from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../controllers/notification.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);

router.get("/unread-count", isAuthenticated, getUnreadCount);

router.patch("/:notificationId/read", isAuthenticated, markAsRead);

export default router;