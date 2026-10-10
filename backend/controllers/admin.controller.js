import User from "../models/user.model.js";
import Report from "../models/report.model.js";
import Notification from "../models/notification.model.js";
import Payment from "../models/payment.model.js";
import Interest from "../models/interest.model.js";
import Match from "../models/match.model.js";
import Message from "../models/Message.js";

// ==========================================
// ADMIN DASHBOARD
// ==========================================
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const maleUsers = await User.countDocuments({
      role: "user",
      gender: "Male",
    });

    const femaleUsers = await User.countDocuments({
      role: "user",
      gender: "Female",
    });

    const verifiedUsers = await User.countDocuments({
      role: "user",
      isVerified: true,
    });

    const completedProfiles = await User.countDocuments({
      role: "user",
      profileCompleted: true,
    });

    const recentUsers = await User.find({
      role: "user",
    })
      .select(
        "fullName email phone gender city state isVerified profileCompleted createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        maleUsers,
        femaleUsers,
        verifiedUsers,
        completedProfiles,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard",
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const { search, gender, verified } = req.query;

    const filter = {
      role: "user",
    };

    if (gender && gender !== "All") {
      filter.gender = gender;
    }

    if (verified === "true") {
      filter.isVerified = true;
    } else if (verified === "false") {
      filter.isVerified = false;
    }

    if (search) {
      filter.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch users",
    });
  }
};

// ==========================================
// GET USER DETAILS
// ==========================================
export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "user",
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Admin User Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user details",
    });
  }
};

// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Toggle User Block Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user status",
    });
  }
};

// ==========================================
// VERIFY / UNVERIFY USER
// ==========================================
export const toggleUserVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = !user.isVerified;

    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isVerified
        ? "User verified successfully"
        : "User verification removed",
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Toggle Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update verification",
    });
  }
};

// ==========================================
// DELETE USER + ALL RELATED DATA
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check user exists
    const user = await User.findOne({
      _id: id,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------------
    // Delete Interests
    // --------------------------------------
    await Interest.deleteMany({
      $or: [
        { sender: id },
        { receiver: id },
      ],
    });

    // --------------------------------------
    // Delete Matches
    // Match model uses users array
    // --------------------------------------
    await Match.deleteMany({
      users: id,
    });

    // --------------------------------------
    // Delete Messages
    // --------------------------------------
    await Message.deleteMany({
      $or: [
        { sender: id },
        { receiver: id },
      ],
    });

    // --------------------------------------
    // Delete Notifications
    // User can be recipient or sender
    // --------------------------------------
    await Notification.deleteMany({
      $or: [
        { recipient: id },
        { sender: id },
      ],
    });

    // --------------------------------------
    // Delete Reports
    // User can be reporter or reported user
    // --------------------------------------
    await Report.deleteMany({
      $or: [
        { reportedBy: id },
        { reportedUser: id },
      ],
    });

    // --------------------------------------
    // Delete Payment Records
    // --------------------------------------
    await Payment.deleteMany({
      userId: id,
    });

    // --------------------------------------
    // Finally Delete User
    // --------------------------------------
    await User.deleteOne({
      _id: id,
      role: "user",
    });

    return res.status(200).json({
      success: true,
      message: "User and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ==========================================
// GET ALL REPORTS
// ==========================================
export const getAllReports = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate(
        "reportedBy",
        "fullName email phone"
      )
      .populate(
        "reportedUser",
        "fullName email phone profileImage isBlocked"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reports",
    });
  }
};

// ==========================================
// UPDATE REPORT STATUS
// ==========================================
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "Pending",
      "Under Review",
      "Resolved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;

    if (typeof adminNote === "string") {
      report.adminNote = adminNote.trim();
    }

    await report.save();

    const adminId = req.userId;

    // Check whether reporting user still exists
    const reportingUser = await User.findById(
      report.reportedBy
    );

    if (reportingUser) {
      await Notification.create({
        recipient: report.reportedBy,
        sender: adminId,
        type: "report_update",
        title: "Report Status Updated",
        message: `Your report status has been changed to ${status}.`,
        relatedId: report._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update Report Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update report",
    });
  }
};

// ==========================================
// ADMIN PAYMENT STATISTICS
// ==========================================
export const getAdminPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      status: "Paid",
    })
      .populate(
        "userId",
        "fullName email phone"
      )
      .sort({ createdAt: -1 });

    const totalPayments = payments.length;

    const totalRevenue = payments.reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

    const silverPayments = payments.filter(
      (payment) =>
        payment.plan === "Silver"
    ).length;

    const goldPayments = payments.filter(
      (payment) =>
        payment.plan === "Gold"
    ).length;

    return res.status(200).json({
      success: true,

      stats: {
        totalPayments,
        totalRevenue,
        silverPayments,
        goldPayments,
      },

      payments,
    });
  } catch (error) {
    console.error("Admin Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment data",
    });
  }
};