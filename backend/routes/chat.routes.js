import express from "express";
import isAuthenticated from "../middleware/auth.middleware.js";
import { getChatMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:matchId", isAuthenticated, getChatMessages);

export default router;