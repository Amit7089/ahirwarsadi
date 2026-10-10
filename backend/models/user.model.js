import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // Membership Details
    membershipPlan: {
      type: String,
      enum: ["Free", "Silver", "Gold"],
      default: "Free",
    },

    membershipStatus: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },

    membershipStartDate: {
      type: Date,
      default: null,
    },

    membershipExpiryDate: {
      type: Date,
      default: null,
    },

    membershipPaymentId: {
      type: String,
      default: "",
    },

    // Matrimonial Profile Fields
    dateOfBirth: Date,
    height: String,
    education: String,
    profession: String,
    annualIncome: String,
    city: String,
    state: String,

    aboutMe: {
      type: String,
      maxlength: 500,
    },

    maritalStatus: {
      type: String,
      enum: ["Never Married", "Divorced", "Widowed"],
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Multiple Profile Photos
    photoGallery: {
      type: [String],
      default: [],
    },

    // Partner Preferences
    partnerPreferences: {
      minAge: {
        type: Number,
        min: 18,
        default: 21,
      },

      maxAge: {
        type: Number,
        min: 18,
        default: 30,
      },

      minHeight: {
        type: String,
        default: "",
      },

      maxHeight: {
        type: String,
        default: "",
      },

      education: {
        type: String,
        default: "",
      },

      profession: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      maritalStatus: {
        type: String,
        enum: ["Any", "Never Married", "Divorced", "Widowed"],
        default: "Any",
      },
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
