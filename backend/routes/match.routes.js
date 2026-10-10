
import express from "express";
import { getMyMatches } from "../controllers/match.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyMatches);

export default router;
