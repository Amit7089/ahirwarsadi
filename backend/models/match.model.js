
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    interest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interest",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    matchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
