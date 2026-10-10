import Interest from "../models/interest.model.js";
import User from "../models/user.model.js";

import Match from "../models/match.model.js";
import Notification from "../models/notification.model.js";

import {
  isMembershipActive,
  syncMembershipStatus,
} from "../utils/membership.js";

const FREE_MONTHLY_INTEREST_LIMIT = 5;

// Send Interest
export const sendInterest = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    // -----------------------------------
    // 1. Receiver ID validation
    // -----------------------------------
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    // -----------------------------------
    // 2. Cannot send interest to yourself
    // -----------------------------------
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send interest to yourself",
      });
    }

    // -----------------------------------
    // 3. Get sender membership information
    // -----------------------------------
    const sender = await User.findById(senderId).select(
      "membershipPlan membershipStatus membershipExpiryDate"
    );

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: "Sender user not found",
      });
    }

    // -----------------------------------
    // 4. Sync expired membership
    // -----------------------------------
    await syncMembershipStatus(sender);

    // -----------------------------------
    // 5. Check active premium membership
    // -----------------------------------
    const premiumActive = isMembershipActive(sender);

    // -----------------------------------
    // 6. Free user monthly interest limit
    // -----------------------------------
    if (!premiumActive) {
      const startOfMonth = new Date();

      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfNextMonth = new Date(startOfMonth);

      startOfNextMonth.setMonth(
        startOfNextMonth.getMonth() + 1
      );

      const interestCount = await Interest.countDocuments({
        sender: senderId,
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });

      if (interestCount >= FREE_MONTHLY_INTEREST_LIMIT) {
        return res.status(403).json({
          success: false,
          message:
            "You have reached your monthly limit of 5 interests. Upgrade to Silver or Gold for unlimited interests.",
          limitReached: true,
          monthlyLimit: FREE_MONTHLY_INTEREST_LIMIT,
          used: interestCount,
          remaining: 0,
        });
      }
    }

    // -----------------------------------
    // 7. Validate receiver profile
    // -----------------------------------
    const receiver = await User.findOne({
      _id: receiverId,
      role: "user",
      isVerified: true,
      isBlocked: false,
      profileCompleted: true,
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "This profile is not available",
      });
    }

    // -----------------------------------
    // 8. Check duplicate interest
    // -----------------------------------
    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingInterest) {
      return res.status(400).json({
        success: false,
        message: "Interest already sent",
      });
    }

    // -----------------------------------
    // 9. Create interest
    // -----------------------------------
    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
    });

    // -----------------------------------
    // 10. Send notification
    // -----------------------------------
    await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "interest",
      title: "New Interest ❤️",
      message: "Someone has sent you an interest!",
      relatedId: interest._id,
    });

    // -----------------------------------
    // 11. Calculate remaining interests
    // -----------------------------------
    let remaining = null;

    if (!premiumActive) {
      const startOfMonth = new Date();

      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfNextMonth = new Date(startOfMonth);

      startOfNextMonth.setMonth(
        startOfNextMonth.getMonth() + 1
      );

      const usedAfterSending = await Interest.countDocuments({
        sender: senderId,
        createdAt: {
          $gte: startOfMonth,
          $lt: startOfNextMonth,
        },
      });

      remaining = Math.max(
        FREE_MONTHLY_INTEREST_LIMIT - usedAfterSending,
        0
      );
    }

    return res.status(201).json({
      success: true,
      message: "Interest sent successfully ❤️",
      interest,
      membership: {
        plan: premiumActive
          ? sender.membershipPlan
          : "Free",
        unlimited: premiumActive,
        monthlyLimit: premiumActive
          ? null
          : FREE_MONTHLY_INTEREST_LIMIT,
        remaining,
      },
    });
  } catch (error) {
    console.error("Send interest error:", error);

    // -----------------------------------
    // Duplicate key protection
    // -----------------------------------
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Interest already sent",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Received Interests
export const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.userId,
    })
      .populate(
        "sender",
        "name fullName gender dateOfBirth city state education profession profileImage"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interests,
    });
  } catch (error) {
    console.error("Received interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Respond to Interest
export const respondToInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const { status } = req.body;

    // -----------------------------------
    // 1. Validate status
    // -----------------------------------
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // -----------------------------------
    // 2. Find pending interest
    // -----------------------------------
    const interest = await Interest.findOne({
      _id: interestId,
      receiver: req.userId,
      status: "pending",
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Pending interest not found",
      });
    }

    // -----------------------------------
    // 3. Update interest status
    // -----------------------------------
    interest.status = status;

    await interest.save();

    let match = null;

    // -----------------------------------
    // 4. Create match if accepted
    // -----------------------------------
    if (status === "accepted") {
      match = await Match.findOne({
        interest: interest._id,
      });

      if (!match) {
        match = await Match.create({
          users: [interest.sender, interest.receiver],
          interest: interest._id,
          status: "active",
        });

        // -----------------------------------
        // 5. Match notification
        // -----------------------------------
        await Notification.create({
          recipient: interest.sender,
          sender: interest.receiver,
          type: "match",
          title: "New Match 🎉",
          message:
            "Your interest was accepted. You have a new match!",
          relatedId: match._id,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message:
        status === "accepted"
          ? "Interest accepted! It's a Match ❤️"
          : "Interest rejected successfully",
      interest,
      match,
    });
  } catch (error) {
    console.error("Respond interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET INTEREST STATS
// ==========================================

export const getInterestStats = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select(
      "membershipPlan membershipStatus membershipExpiryDate"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sync membership expiry
    await syncMembershipStatus(user);

    const membershipActive =
      isMembershipActive(user);

    // Silver / Gold
    if (membershipActive) {
      return res.status(200).json({
        success: true,
        stats: {
          plan: user.membershipPlan,
          monthlyLimit: null,
          used: null,
          remaining: null,
          unlimited: true,
        },
      });
    }

    // Free user
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    const used = await Interest.countDocuments({
      sender: userId,
      createdAt: {
        $gte: startOfMonth,
        $lt: startOfNextMonth,
      },
    });

    const monthlyLimit = 5;

    const remaining = Math.max(
      monthlyLimit - used,
      0
    );

    return res.status(200).json({
      success: true,
      stats: {
        plan: "Free",
        monthlyLimit,
        used,
        remaining,
        unlimited: false,
      },
    });
  } catch (error) {
    console.error(
      "Get Interest Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get interest stats",
    });
  }
};