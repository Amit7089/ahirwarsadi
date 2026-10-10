
import Notification from "../models/notification.model.js";
import Interest from "../models/interest.model.js";

// Get All Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.userId,
    })
      .populate("sender", "fullName profileImage")
      .sort({ createdAt: -1 });

    // Sirf pending interest notifications show hongi
    const filteredNotifications = await Promise.all(
      notifications.map(async (notification) => {
        if (notification.type !== "interest") {
          return notification;
        }

        const interest = await Interest.findById(
          notification.relatedId
        );

        if (!interest || interest.status !== "pending") {
          return null;
        }

        return notification;
      })
    );

    return res.status(200).json({
      success: true,
      notifications: filteredNotifications.filter(Boolean),
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Unread Notification Count
export const getUnreadCount = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.userId,
      isRead: false,
    });

    let count = 0;

    for (const notification of notifications) {
      if (notification.type !== "interest") {
        count++;
        continue;
      }

      const interest = await Interest.findById(
        notification.relatedId
      );

      if (interest && interest.status === "pending") {
        count++;
      }
    }

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: req.userId,
      },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
