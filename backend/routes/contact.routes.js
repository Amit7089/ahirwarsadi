
import express from "express";
import { getMatchedContact } from "../controllers/contact.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", isAuthenticated, getMatchedContact);

export default router;
