
import express from "express";

import {
  updateProfile,
  getMyProfile,
  getAllProfiles,
  getProfileById,
  uploadProfileImage,
  uploadGalleryPhoto,
  deleteGalleryPhoto,
   updatePartnerPreferences,
} from "../controllers/profile.controller.js";

import isAuthenticated from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", isAuthenticated, getMyProfile);

// Update profile
router.put("/update", isAuthenticated, updateProfile);

// Upload main profile photo
router.post(
  "/upload-photo",
  isAuthenticated,
  upload.single("profileImage"),
  uploadProfileImage
);

// Upload gallery photo
router.post(
  "/upload-gallery",
  isAuthenticated,
  upload.single("profileImage"),
  uploadGalleryPhoto
);

// Delete gallery photo
router.delete(
  "/delete-gallery",
  isAuthenticated,
  deleteGalleryPhoto
);

// Update partner preferences
router.put(
  "/partner-preferences",
  isAuthenticated,
  updatePartnerPreferences
);

// Get all profiles
router.get("/all", isAuthenticated, getAllProfiles);

// Get profile by ID
router.get("/:id", isAuthenticated, getProfileById);

export default router;
