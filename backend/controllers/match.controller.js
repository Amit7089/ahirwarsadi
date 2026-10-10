import Match from "../models/match.model.js";

export const getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      users: req.userId,
      status: "active",
    })
      .populate(
        "users",
        "fullName gender dateOfBirth city state education profession profileImage",
      )
      .sort({ matchedAt: -1 });

    return res.status(200).json({
      success: true,
      currentUserId: req.userId.toString(),
      matches,
    });
  } catch (error) {
    console.error("Get matches error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
