import User from "../models/user.model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

import {
  isMembershipActive,
  syncMembershipStatus,
} from "../utils/membership.js";

// ===================================
// HELPER - CALCULATE AGE
// ===================================

const calculateAge = (dob) => {
  if (!dob) return null;

  const today = new Date();
  const birthDate = new Date(dob);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// ===================================
// HELPER - NORMALIZE TEXT
// ===================================

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

// ===================================
// HELPER - HEIGHT TO CM
// Supports:
// 5'6
// 5'6"
// 5 ft 6 in
// 5 feet 6 inches
// 165 cm
// ===================================

const heightToCm = (height) => {
  if (!height) return null;

  const value = String(height).trim().toLowerCase();

  // 5'6 or 5'6"
  const feetInches = value.match(/^(\d+)\s*(?:'|ft)\s*(\d+)?\s*(?:"|in)?$/);

  if (feetInches) {
    const feet = Number(feetInches[1]);
    const inches = Number(feetInches[2] || 0);

    return Math.round(feet * 30.48 + inches * 2.54);
  }

  // 5 feet 6 inches
  const feetWords = value.match(/(\d+)\s*feet?\s*(\d+)?\s*inches?/);

  if (feetWords) {
    const feet = Number(feetWords[1]);
    const inches = Number(feetWords[2] || 0);

    return Math.round(feet * 30.48 + inches * 2.54);
  }

  // 165 cm
  const cmMatch = value.match(/(\d+(?:\.\d+)?)\s*cm/);

  if (cmMatch) {
    return Number(cmMatch[1]);
  }

  // Plain number
  const numericValue = Number(value);

  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  return null;
};

// ===================================
// HELPER - TEXT FIELD MATCH
// ===================================

const textFieldMatches = (preferredValue, candidateValue) => {
  const preferred = normalizeText(preferredValue);

  const candidate = normalizeText(candidateValue);

  if (!preferred || !candidate) {
    return false;
  }

  return candidate.includes(preferred) || preferred.includes(candidate);
};

// ===================================
// HELPER - CALCULATE MATCH SCORE
// ===================================

const calculateMatchScore = (currentUser, candidate) => {
  const preferences = currentUser.partnerPreferences || {};

  let matchedFields = 0;
  let checkedFields = 0;

  const matchReasons = [];
  const unmatchedReasons = [];

  // ===================================
  // AGE
  // ===================================

  const candidateAge = calculateAge(candidate.dateOfBirth);

  const minAge = Number(preferences.minAge ?? 21);

  const maxAge = Number(preferences.maxAge ?? 30);

  if (candidateAge !== null) {
    checkedFields++;

    if (candidateAge >= minAge && candidateAge <= maxAge) {
      matchedFields++;
      matchReasons.push("Age matches");
    } else {
      unmatchedReasons.push("Age differs");
    }
  }

  // ===================================
  // HEIGHT
  // ===================================

  const candidateHeight = heightToCm(candidate.height);

  const minHeight = heightToCm(preferences.minHeight);

  const maxHeight = heightToCm(preferences.maxHeight);

  if (candidateHeight !== null && (minHeight !== null || maxHeight !== null)) {
    checkedFields++;

    const heightMatches =
      (minHeight === null || candidateHeight >= minHeight) &&
      (maxHeight === null || candidateHeight <= maxHeight);

    if (heightMatches) {
      matchedFields++;
      matchReasons.push("Height matches");
    } else {
      unmatchedReasons.push("Height differs");
    }
  }

  // ===================================
  // EDUCATION
  // ===================================

  if (normalizeText(preferences.education)) {
    checkedFields++;

    if (textFieldMatches(preferences.education, candidate.education)) {
      matchedFields++;
      matchReasons.push("Education matches");
    } else {
      unmatchedReasons.push("Education differs");
    }
  }

  // ===================================
  // PROFESSION
  // ===================================

  if (normalizeText(preferences.profession)) {
    checkedFields++;

    if (textFieldMatches(preferences.profession, candidate.profession)) {
      matchedFields++;
      matchReasons.push("Profession matches");
    } else {
      unmatchedReasons.push("Profession differs");
    }
  }

  // ===================================
  // CITY
  // ===================================

  if (normalizeText(preferences.city)) {
    checkedFields++;

    if (normalizeText(candidate.city) === normalizeText(preferences.city)) {
      matchedFields++;
      matchReasons.push("City matches");
    } else {
      unmatchedReasons.push("City differs");
    }
  }

  // ===================================
  // STATE
  // ===================================

  if (normalizeText(preferences.state)) {
    checkedFields++;

    if (normalizeText(candidate.state) === normalizeText(preferences.state)) {
      matchedFields++;
      matchReasons.push("State matches");
    } else {
      unmatchedReasons.push("State differs");
    }
  }

  // ===================================
  // MARITAL STATUS
  // ===================================

  if (preferences.maritalStatus && preferences.maritalStatus !== "Any") {
    checkedFields++;

    if (candidate.maritalStatus === preferences.maritalStatus) {
      matchedFields++;
      matchReasons.push("Marital status matches");
    } else {
      unmatchedReasons.push("Marital status differs");
    }
  }

  // ===================================
  // SCORE
  // ===================================

  const matchScore =
    checkedFields > 0 ? Math.round((matchedFields / checkedFields) * 100) : 0;

  // ===================================
  // RECOMMENDATION
  //
  // 60% or above = Recommended
  // ===================================

  const isRecommended = checkedFields > 0 && matchScore >= 60;


  return {
    matchScore,
    matchedFields,
    checkedFields,
    isRecommended,
    matchReasons,
    unmatchedReasons,
  };
};

// ===================================
// UPDATE PROFILE
// ===================================

export const updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      height,
      education,
      profession,
      annualIncome,
      city,
      state,
      aboutMe,
      maritalStatus,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        dateOfBirth,
        height,
        education,
        profession,
        annualIncome,
        city,
        state,
        aboutMe,
        maritalStatus,
        profileCompleted: true,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===================================
// GET MY PROFILE
// ===================================

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await syncMembershipStatus(user);

    const membershipActive = isMembershipActive(user);

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),

        membershipActive,

        membershipBadge: membershipActive ? user.membershipPlan : null,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ===================================
// GET ALL MATRIMONIAL PROFILES
// WITH PREFERENCE RECOMMENDATIONS
// ===================================

export const getAllProfiles = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // ===================================
    // GET CURRENT USER
    // ===================================

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===================================
    // SYNC MEMBERSHIP
    // ===================================

    await syncMembershipStatus(currentUser);

    // ===================================
    // OPPOSITE GENDER
    // ===================================

    const oppositeGender = currentUser.gender === "Male" ? "Female" : "Male";

    // ===================================
    // GET ELIGIBLE PROFILES
    // ===================================

    const profiles = await User.find({
      _id: {
        $ne: currentUserId,
      },

      role: "user",

      isVerified: true,

      isBlocked: false,

      profileCompleted: true,

      gender: oppositeGender,
    }).select(
      "fullName gender dateOfBirth height education profession annualIncome city state aboutMe maritalStatus profileImage photoGallery isVerified membershipPlan membershipStatus membershipExpiryDate createdAt",
    );

    // ===================================
    // FORMAT PROFILES
    // ===================================

    const formattedProfiles = profiles.map((user) => {
      const profile = user.toObject();

      // -----------------------------------
      // MEMBERSHIP
      // -----------------------------------

      const membershipActive = isMembershipActive(user);

      let membershipPriority = 0;

      if (membershipActive) {
        if (user.membershipPlan === "Gold") {
          membershipPriority = 2;
        } else if (user.membershipPlan === "Silver") {
          membershipPriority = 1;
        }
      }

      // -----------------------------------
      // PREFERENCE MATCH
      // -----------------------------------

      const {
        matchScore,
        matchedFields,
        checkedFields,
        isRecommended,
        matchReasons,
        unmatchedReasons,
      } = calculateMatchScore(currentUser, user);

      return {
        ...profile,

        age: calculateAge(user.dateOfBirth),

        membershipActive,

        membershipBadge: membershipActive ? user.membershipPlan : null,

        matchScore,

        matchedFields,

        checkedFields,

        isRecommended,

        matchReasons,

        unmatchedReasons,

        membershipPriority,
      };
    });

    // ===================================
    // SORTING
    //
    // 1. Recommended
    // 2. Match percentage
    // 3. Gold
    // 4. Silver
    // 5. Free
    // 6. Newest
    // ===================================

    formattedProfiles.sort((a, b) => {
      // Recommended first
      if (a.isRecommended !== b.isRecommended) {
        return Number(b.isRecommended) - Number(a.isRecommended);
      }

      // Higher match first
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      // Premium priority
      if (b.membershipPriority !== a.membershipPriority) {
        return b.membershipPriority - a.membershipPriority;
      }

      // Newest profile first
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // ===================================
    // REMOVE INTERNAL MEMBERSHIP FIELDS
    // ===================================

    const cleanProfiles = formattedProfiles.map(
      ({
        membershipPriority,
        membershipStatus,
        membershipExpiryDate,
        membershipPlan,
        ...profile
      }) => profile,
    );

    // ===================================
    // RESPONSE
    // ===================================

    return res.status(200).json({
      success: true,
      count: cleanProfiles.length,
      profiles: cleanProfiles,
    });
  } catch (error) {
    console.error("Get All Profiles Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profiles",
    });
  }
};

// ===================================
// GET PROFILE BY ID
// ===================================

export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID",
      });
    }

    const profile = await User.findOne({
      _id: id,
      role: "user",
      isVerified: true,
      isBlocked: false,
      profileCompleted: true,
    }).select(
      "fullName gender dateOfBirth height education profession annualIncome city state aboutMe maritalStatus profileImage photoGallery isVerified membershipPlan membershipStatus membershipExpiryDate",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found or unavailable",
      });
    }

    await syncMembershipStatus(profile);

    const membershipActive = isMembershipActive(profile);

    const age = calculateAge(profile.dateOfBirth);

    return res.status(200).json({
      success: true,

      profile: {
        ...profile.toObject(),

        age,

        membershipActive,

        membershipBadge: membershipActive ? profile.membershipPlan : null,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===================================
// UPLOAD PROFILE IMAGE
// ===================================

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ahirwarsadi/profile_photos",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    user.profileImage = result.secure_url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload profile photo",
    });
  }
};

// ===================================
// UPLOAD GALLERY PHOTO
// ===================================

export const uploadGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.photoGallery.length >= 6) {
      return res.status(400).json({
        success: false,
        message: "Maximum 6 gallery photos allowed",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ahirwarsadi/gallery_photos",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    user.photoGallery.push(result.secure_url);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Gallery photo uploaded successfully",
      photoGallery: user.photoGallery,
    });
  } catch (error) {
    console.error("Gallery Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload gallery photo",
    });
  }
};

// ===================================
// DELETE GALLERY PHOTO
// ===================================

export const deleteGalleryPhoto = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.photoGallery.includes(imageUrl)) {
      return res.status(404).json({
        success: false,
        message: "Gallery photo not found",
      });
    }

    user.photoGallery = user.photoGallery.filter((photo) => photo !== imageUrl);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Gallery photo removed successfully",
      photoGallery: user.photoGallery,
    });
  } catch (error) {
    console.error("Gallery Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete gallery photo",
    });
  }
};

// ===================================
// UPDATE PARTNER PREFERENCES
// ===================================

export const updatePartnerPreferences = async (req, res) => {
  try {
    const {
      minAge,
      maxAge,
      minHeight,
      maxHeight,
      education,
      profession,
      city,
      state,
      maritalStatus,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ===================================
    // FINAL AGE VALUES
    // ===================================

    const finalMinAge = minAge ?? user.partnerPreferences?.minAge ?? 21;

    const finalMaxAge = maxAge ?? user.partnerPreferences?.maxAge ?? 30;

    // ===================================
    // AGE VALIDATION
    // ===================================

    if (
      Number.isNaN(Number(finalMinAge)) ||
      Number.isNaN(Number(finalMaxAge)) ||
      Number(finalMinAge) < 18 ||
      Number(finalMaxAge) < 18 ||
      Number(finalMinAge) > Number(finalMaxAge) ||
      Number(finalMinAge) > 100 ||
      Number(finalMaxAge) > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid age range between 18 and 100",
      });
    }

    // ===================================
    // MARITAL STATUS VALIDATION
    // ===================================

    const finalMaritalStatus =
      maritalStatus ?? user.partnerPreferences?.maritalStatus ?? "Any";

    const allowedMaritalStatuses = [
      "Any",
      "Never Married",
      "Divorced",
      "Widowed",
    ];

    if (!allowedMaritalStatuses.includes(finalMaritalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid marital status",
      });
    }

    // ===================================
    // SAVE PREFERENCES
    // ===================================

    user.partnerPreferences = {
      minAge: Number(finalMinAge),

      maxAge: Number(finalMaxAge),

      minHeight: minHeight ?? user.partnerPreferences?.minHeight ?? "",

      maxHeight: maxHeight ?? user.partnerPreferences?.maxHeight ?? "",

      education: education ?? user.partnerPreferences?.education ?? "",

      profession: profession ?? user.partnerPreferences?.profession ?? "",

      city: city ?? user.partnerPreferences?.city ?? "",

      state: state ?? user.partnerPreferences?.state ?? "",

      maritalStatus: finalMaritalStatus,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Partner preferences saved successfully",
      partnerPreferences: user.partnerPreferences,
    });
  } catch (error) {
    console.error("Update Partner Preferences Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save partner preferences",
    });
  }
};
