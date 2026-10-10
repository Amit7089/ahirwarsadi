import {
  getMembershipAccess,
  syncMembershipStatus,
} from "../utils/membership.js";

import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Membership Plans
const plans = {
  Silver: {
    price: 499,
    duration: 3,
  },
  Gold: {
    price: 999,
    duration: 6,
  },
};

// Get All Membership Plans
export const getMembershipPlans = async (req, res) => {
  try {
    const membershipPlans = [
      {
        id: "free",
        name: "Free",
        price: 0,
        duration: 0,
        features: [
          "Create Your Profile",
          "Browse Profiles",
          "Limited Interests",
          "Receive Interests",
          "Basic Notifications",
        ],
      },
      {
        id: "silver",
        name: "Silver",
        price: 499,
        duration: 3,
        features: [
          "Unlimited Interests",
          "View Contact Details",
          "See Who Liked You",
          "Priority Profile Visibility",
          "Silver Premium Badge",
          "Priority Support",
        ],
      },
      {
        id: "gold",
        name: "Gold",
        price: 999,
        duration: 6,
        features: [
          "All Silver Features",
          "Priority Support",
          "Advanced Profile Visibility",
          "Gold Premium Badge",
          "Unlimited Profile Browsing",
        ],
      },
    ];

    return res.status(200).json({
      success: true,
      plans: membershipPlans,
    });
  } catch (error) {
    console.error("Get Membership Plans Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch membership plans",
    });
  }
};

// Get Logged-in User Membership
export const getMyMembership = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "membershipPlan membershipStatus membershipStartDate membershipExpiryDate"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await syncMembershipStatus(user);

    const access = getMembershipAccess(user);

    return res.status(200).json({
      success: true,
      membership: {
        plan: access.isActive ? user.membershipPlan : "Free",
        status: access.isActive
          ? user.membershipStatus
          : "Expired",

        startDate: user.membershipStartDate,
        expiryDate: user.membershipExpiryDate,

        isActive: access.isActive,
        isSilver: access.isSilver,
        isGold: access.isGold,
      },
    });
  } catch (error) {
    console.error("Get My Membership Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch membership",
    });
  }
};

// Create Razorpay Order
export const createMembershipOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plans[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid membership plan",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      console.error("Razorpay credentials are missing");

      return res.status(500).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sync expired membership before creating new order
    await syncMembershipStatus(user);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: plans[plan].price * 100,
      currency: "INR",
      receipt: `membership_${req.userId}_${Date.now()}`,
      notes: {
        userId: req.userId.toString(),
        plan,
      },
    });

    await Payment.create({
      userId: req.userId,
      orderId: order.id,
      plan,
      amount: plans[plan].price,
      currency: "INR",
      status: "Created",
    });

    return res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Membership Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// Verify Payment and Activate Membership
export const verifyMembershipPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret is missing");

      return res.status(500).json({
        success: false,
        message: "Payment service is not configured",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "hex"
    );

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      "hex"
    );

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Fetch order and payment from Razorpay
    const order = await razorpay.orders.fetch(
      razorpay_order_id
    );

    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    const plan = order.notes?.plan;
    const orderUserId = order.notes?.userId;

    // Validate Razorpay data
    if (
      !plans[plan] ||
      orderUserId !== req.userId.toString() ||
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured" ||
      order.status !== "paid" ||
      order.amount !== plans[plan].price * 100 ||
      payment.amount !== plans[plan].price * 100 ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are invalid",
      });
    }

    // Find local payment record
    const paymentRecord = await Payment.findOne({
      orderId: razorpay_order_id,
      userId: req.userId,
    });

    if (!paymentRecord) {
      return res.status(400).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Prevent duplicate processing
    if (paymentRecord.status === "Paid") {
      return res.status(409).json({
        success: false,
        message: "This payment has already been processed",
      });
    }

    // Verify local payment plan and amount
    if (
      paymentRecord.plan !== plan ||
      paymentRecord.amount !== plans[plan].price
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment record does not match the order",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Membership dates
    const startDate = new Date();
    const expiryDate = new Date(startDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + plans[plan].duration
    );

    // Activate membership
    user.membershipPlan = plan;
    user.membershipStatus = "Active";
    user.membershipStartDate = startDate;
    user.membershipExpiryDate = expiryDate;
    user.membershipPaymentId = razorpay_payment_id;

    await user.save();

    // Update payment history
    paymentRecord.paymentId = razorpay_payment_id;
    paymentRecord.status = "Paid";
    paymentRecord.paymentMethod = payment.method || "";
    paymentRecord.paidAt = new Date();

    await paymentRecord.save();

    return res.status(200).json({
      success: true,
      message: `${plan} membership activated successfully`,
      membership: {
        plan,
        status: "Active",
        startDate,
        expiryDate,
      },
    });
  } catch (error) {
    console.error(
      "Verify Membership Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// Get Logged-in User Payment History
export const getMyPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get Payment History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment history",
    });
  }
};