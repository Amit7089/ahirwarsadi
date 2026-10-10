import Message from "../models/Message.js";
import Match from "../models/match.model.js";

export const getChatMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId;

    // Check whether the match exists and is active
    const match = await Match.findOne({
      _id: matchId,
      users: userId,
      status: "active",
    });

    if (!match) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this chat",
      });
    }

    // Get chat messages
    const messages = await Message.find({
      match: matchId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName")
      .populate("receiver", "fullName");

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Chat Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load chat messages",
    });
  }
};