import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "Fake Profile",
        "Wrong Information",
        "Inappropriate Photos",
        "Harassment",
        "Scam or Fraud",
        "Already Married",
        "Other",
      ],
      required: true,
    },

    description: {
      type: String,
      maxlength: 1000,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Resolved", "Rejected"],
      default: "Pending",
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;