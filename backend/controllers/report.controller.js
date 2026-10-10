
import Report from "../models/report.model.js";
import User from "../models/user.model.js";

// Submit a report
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason, description } = req.body;

    if (!reportedUserId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Reported user and reason are required",
      });
    }

    if (reportedUserId === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own profile",
      });
    }

    const reportedUser = await User.findOne({
      _id: reportedUserId,
      role: "user",
    });

    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: "Reported user not found",
      });
    }

    const validReasons = [
      "Fake Profile",
      "Wrong Information",
      "Inappropriate Photos",
      "Harassment",
      "Scam or Fraud",
      "Already Married",
      "Other",
    ];

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason",
      });
    }

    const existingReport = await Report.findOne({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      status: { $in: ["Pending", "Under Review"] },
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You already have an active report for this user",
      });
    }

    const report = await Report.create({
      reportedBy: req.userId,
      reportedUser: reportedUserId,
      reason,
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};

// Get My Reports
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reportedBy: req.userId,
    })
      .populate("reportedUser", "fullName profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalReports: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get My Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your reports",
    });
  }
};
