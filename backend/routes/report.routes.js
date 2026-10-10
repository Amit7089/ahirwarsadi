
import express from "express";
import {
  createReport,
  getMyReports,
} from "../controllers/report.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createReport);

router.get("/my-reports", isAuthenticated, getMyReports);

export default router;
