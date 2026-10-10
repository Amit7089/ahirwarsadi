import User from "../models/user.model.js";
import Match from "../models/match.model.js";
import mongoose from "mongoose";

export const getMatchedContact = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { id: profileId } = req.params;

    // -----------------------------------
    // 1. Validate profile ID
    // -----------------------------------
    if (!mongoose.isValidObjectId(profileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID",
      });
    }

    // -----------------------------------
    // 2. User cannot view own contact
    // -----------------------------------
    if (currentUserId.toString() === profileId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot view your own contact here",
      });
    }

    // -----------------------------------
    // 3. Check active match
    // -----------------------------------
    const match = await Match.findOne({
      users: { $all: [currentUserId, profileId] },
      status: "active",
    });

    if (!match) {
      return res.status(403).json({
        success: false,
        message: "Contact details are available only after matching ❤️",
      });
    }

    // -----------------------------------
    // 4. Get current user's membership
    // -----------------------------------
    const currentUser = await User.findById(currentUserId).select(
      "membershipPlan membershipStatus membershipExpiryDate"
    );

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------
    // 5. Check active premium membership
    // -----------------------------------
    const isPremium =
      ["Silver", "Gold"].includes(currentUser.membershipPlan) &&
      currentUser.membershipStatus === "Active" &&
      currentUser.membershipExpiryDate &&
      new Date(currentUser.membershipExpiryDate) > new Date();

    if (!isPremium) {
      // If old premium membership has expired,
      // update status in database.
      if (
        ["Silver", "Gold"].includes(currentUser.membershipPlan) &&
        currentUser.membershipExpiryDate &&
        new Date(currentUser.membershipExpiryDate) <= new Date() &&
        currentUser.membershipStatus !== "Expired"
      ) {
        currentUser.membershipStatus = "Expired";
        await currentUser.save();
      }

      return res.status(403).json({
        success: false,
        message:
          "Contact details are available for Silver and Gold members only. Please upgrade your membership.",
        membershipRequired: true,
      });
    }

    // -----------------------------------
    // 6. Get matched user's contact
    // -----------------------------------
    const user = await User.findOne({
      _id: profileId,
      role: "user",
      isBlocked: false,
    }).select("fullName email phone");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------
    // 7. Return contact details
    // -----------------------------------
    return res.status(200).json({
      success: true,
      contact: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Get matched contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};