import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";

import User from "./models/user.model.js";

import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import interestRoutes from "./routes/interest.routes.js";
import matchRoutes from "./routes/match.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import reportRoutes from "./routes/report.routes.js";
import membershipRoutes from "./routes/membership.routes.js";

import Match from "./models/match.model.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

// ==========================================
// BASIC SECURITY
// ==========================================

app.disable("x-powered-by");

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://ahirwarsadi.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// ==========================================
// BODY PARSER
// ==========================================

app.use(
  express.json({
    limit: "1mb",
  }),
);

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/membership", membershipRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "AhirwarSadi API is running!",
  });
});

// ==========================================
// 404 API HANDLER
// ==========================================

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {
  console.error("Global Error:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// MEMBERSHIP EXPIRY SYNC
// ==========================================

const syncExpiredMemberships = async () => {
  try {
    const result = await User.updateMany(
      {
        membershipPlan: {
          $in: ["Silver", "Gold"],
        },

        membershipStatus: "Active",

        membershipExpiryDate: {
          $lte: new Date(),
        },
      },
      {
        $set: {
          membershipStatus: "Expired",
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(`Expired memberships updated: ${result.modifiedCount}`);
    }
  } catch (error) {
    console.error("Membership Expiry Sync Error:", error);
  }
};

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    // ========================================
    // CONNECT DATABASE
    // ========================================

    await connectDB();

    console.log("MongoDB connected successfully");

    // ========================================
    // INITIAL MEMBERSHIP EXPIRY CHECK
    // ========================================

    await syncExpiredMemberships();

    // ========================================
    // RUN EXPIRY CHECK EVERY 24 HOURS
    // ========================================

    setInterval(syncExpiredMemberships, 24 * 60 * 60 * 1000);

    // ========================================
    // HTTP SERVER
    // ========================================

    const httpServer = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // ========================================
    // SOCKET.IO
    // ========================================


const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});


    // ========================================
    // SOCKET JWT AUTHENTICATION
    // ========================================

    io.use((socket, next) => {
      try {
        const cookies = socket.handshake.headers.cookie || "";

        const tokenCookie = cookies
          .split("; ")
          .find((cookie) => cookie.startsWith("token="));

        if (!tokenCookie) {
          return next(new Error("Please login first"));
        }

        const token = tokenCookie.split("=").slice(1).join("=");

        if (!token) {
          return next(new Error("Invalid authentication token"));
        }

        if (!process.env.JWT_SECRET) {
          return next(new Error("Authentication configuration error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId) {
          return next(new Error("Invalid authentication token"));
        }

        socket.userId = decoded.userId;

        next();
      } catch (error) {
        console.error("Socket Authentication Error:", error.message);

        next(new Error("Invalid or expired token"));
      }
    });

    // ========================================
    // SOCKET CONNECTION
    // ========================================

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.userId}`);

      // ======================================
      // JOIN PRIVATE CHAT ROOM
      // ======================================

      socket.on("chat:join", async (matchId, callback) => {
        try {
          if (!matchId) {
            return callback?.({
              success: false,
              message: "Match ID is required",
            });
          }

          const match = await Match.findOne({
            _id: matchId,
            users: socket.userId,
            status: "active",
          });

          if (!match || match.users.length !== 2) {
            return callback?.({
              success: false,
              message: "You are not allowed to join this chat",
            });
          }

          const roomId = `match:${matchId}`;

          socket.join(roomId);

          callback?.({
            success: true,
            message: "Chat joined successfully",
          });
        } catch (error) {
          console.error("Chat Join Error:", error);

          callback?.({
            success: false,
            message: "Failed to join chat",
          });
        }
      });

      // ======================================
      // SEND MESSAGE
      // ======================================

      socket.on("chat:send", async (data, callback) => {
        try {
          const { matchId, message } = data || {};

          if (
            !matchId ||
            typeof message !== "string" ||
            !message.trim() ||
            message.trim().length > 2000
          ) {
            return callback?.({
              success: false,
              message: "Invalid message",
            });
          }

          const match = await Match.findOne({
            _id: matchId,
            users: socket.userId,
            status: "active",
          });

          if (!match || match.users.length !== 2) {
            return callback?.({
              success: false,
              message: "Active match not found",
            });
          }

          const roomId = `match:${matchId}`;

          if (!socket.rooms.has(roomId)) {
            return callback?.({
              success: false,
              message: "Please join the chat first",
            });
          }

          const receiverId = match.users.find(
            (id) => id.toString() !== socket.userId.toString(),
          );

          if (!receiverId) {
            return callback?.({
              success: false,
              message: "Receiver not found",
            });
          }

          const newMessage = await Message.create({
            match: matchId,
            sender: socket.userId,
            receiver: receiverId,
            message: message.trim(),
          });

          const savedMessage = await Message.findById(newMessage._id)
            .populate("sender", "fullName")
            .populate("receiver", "fullName");

          io.to(roomId).emit("chat:receive", savedMessage);

          callback?.({
            success: true,
            message: "Message sent successfully",
          });
        } catch (error) {
          console.error("Send Message Error:", error);

          callback?.({
            success: false,
            message: "Failed to send message",
          });
        }
      });

      // ======================================
      // TYPING
      // ======================================

      socket.on("chat:typing", async (matchId) => {
        try {
          const match = await Match.findOne({
            _id: matchId,
            users: socket.userId,
            status: "active",
          });

          if (!match || match.users.length !== 2) {
            return;
          }

          const roomId = `match:${matchId}`;

          if (!socket.rooms.has(roomId)) {
            return;
          }

          socket.to(roomId).emit("chat:typing", {
            userId: socket.userId,
          });
        } catch (error) {
          console.error("Typing Error:", error);
        }
      });

      // ======================================
      // STOP TYPING
      // ======================================

      socket.on("chat:stop-typing", async (matchId) => {
        try {
          const match = await Match.findOne({
            _id: matchId,
            users: socket.userId,
            status: "active",
          });

          if (!match || match.users.length !== 2) {
            return;
          }

          const roomId = `match:${matchId}`;

          if (!socket.rooms.has(roomId)) {
            return;
          }

          socket.to(roomId).emit("chat:stop-typing", {
            userId: socket.userId,
          });
        } catch (error) {
          console.error("Stop Typing Error:", error);
        }
      });

      // ======================================
      // READ RECEIPT
      // ======================================

      socket.on("chat:read", async (matchId) => {
        try {
          const match = await Match.findOne({
            _id: matchId,
            users: socket.userId,
            status: "active",
          });

          if (!match || match.users.length !== 2) {
            return;
          }

          const roomId = `match:${matchId}`;

          if (!socket.rooms.has(roomId)) {
            return;
          }

          const result = await Message.updateMany(
            {
              match: matchId,
              receiver: socket.userId,
              isRead: false,
            },
            {
              $set: {
                isRead: true,
              },
            },
          );

          if (result.modifiedCount > 0) {
            socket.to(roomId).emit("chat:read", {
              readerId: socket.userId,
              matchId,
            });
          }
        } catch (error) {
          console.error("Read Receipt Error:", error);
        }
      });

      // ======================================
      // DISCONNECT
      // ======================================

      socket.on("disconnect", (reason) => {
        console.log(`Socket disconnected: ${socket.userId}`, reason);
      });
    });
  } catch (error) {
    console.error("Server startup error:", error);

    process.exit(1);
  }
};

startServer();
