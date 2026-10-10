
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Check,
  Crown,
  Star,
  Sparkles,
  ArrowLeft,
  CreditCard,
  CalendarDays,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "https://ahirwarsadi-api.onrender.com/api/membership";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const Membership = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [membership, setMembership] = useState(null);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Fetch Membership + Plans + Payment History
  const fetchMembershipData = async () => {
    try {
      const [plansRes, membershipRes, paymentsRes] =
        await Promise.all([
          axios.get(`${API}/plans`),

          axios.get(`${API}/my`, {
            withCredentials: true,
          }),

          axios.get(`${API}/payments`, {
            withCredentials: true,
          }),
        ]);

      setPlans(plansRes.data.plans || []);

      setMembership(
        membershipRes.data.membership || null
      );

      setPayments(
        paymentsRes.data.payments || []
      );
    } catch (error) {
      console.error(
        "Membership Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load membership details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembershipData();
  }, []);

  // Choose Membership Plan
  const handleChoosePlan = async (plan) => {
    if (plan.id === "free") {
      toast.info(
        "You are already eligible for Free Membership"
      );
      return;
    }

    if (processing) return;

    try {
      setProcessing(true);

      // Load Razorpay Checkout
      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error(
          "Unable to load payment gateway"
        );

        setProcessing(false);
        return;
      }

      // Create Order from Backend
      const orderResponse = await axios.post(
        `${API}/create-order`,
        {
          plan: plan.name,
        },
        {
          withCredentials: true,
        }
      );

      const { order, key } =
        orderResponse.data;

      // Razorpay Options
      const options = {
        key,

        amount: order.amount,

        currency: order.currency,

        name: "AhirwarSadi.com",

        description: `${plan.name} Membership`,

        order_id: order.id,

        handler: async function (response) {
          try {
            // Verify Payment
            const verifyResponse =
              await axios.post(
                `${API}/verify-payment`,
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  withCredentials: true,
                }
              );

            if (
              verifyResponse.data.success
            ) {
              toast.success(
                verifyResponse.data.message ||
                  "Membership activated successfully!"
              );

              // Refresh membership
              // and payment history
              await fetchMembershipData();
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            toast.error(
              error.response?.data?.message ||
                "Payment verification failed. Contact support if amount was deducted."
            );
          } finally {
            setProcessing(false);
          }
        },

        modal: {
          ondismiss: function () {
            setProcessing(false);

            toast.info(
              "Payment cancelled"
            );
          },
        },

        theme: {
          color: "#db2777",
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      // Payment Failed
      paymentObject.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          toast.error(
            response.error.description ||
              "Payment failed"
          );

          setProcessing(false);
        }
      );

      // Open Razorpay
      paymentObject.open();
    } catch (error) {
      console.error(
        "Create Order Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to start payment. Please try again."
      );

      setProcessing(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="font-semibold text-pink-600">
          Loading Membership Plans...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />

            Go Back
          </button>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <Crown size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 md:text-5xl">
            Choose Your Membership
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Find your perfect life partner with
            premium features on
            AhirwarSadi.com.
          </p>
        </div>

        {/* ================= CURRENT MEMBERSHIP ================= */}

        {membership && (
          <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-pink-200 bg-white p-6 text-center shadow-md">
            <p className="text-sm font-medium text-gray-500">
              Your Current Membership
            </p>

            <h2 className="mt-2 text-3xl font-bold text-pink-600">
              {membership.plan}
            </h2>

            <span
              className={`mt-3 inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                membership.status ===
                "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {membership.status}
            </span>

            {membership.startDate && (
              <p className="mt-3 text-sm text-gray-500">
                Started:{" "}
                {new Date(
                  membership.startDate
                ).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            )}

            {membership.expiryDate && (
              <p className="mt-1 text-sm text-gray-500">
                Expires:{" "}
                {new Date(
                  membership.expiryDate
                ).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            )}
          </div>
        )}

        {/* ================= MEMBERSHIP PLANS ================= */}

        <div className="grid gap-7 md:grid-cols-3">
          {plans.map((plan) => {
            const isSilver =
              plan.id === "silver";

            const isGold =
              plan.id === "gold";

            const isCurrentPlan =
              membership?.plan?.toLowerCase() ===
                plan.name.toLowerCase() &&
              membership?.status === "Active";

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl md:p-8 ${
                  isSilver
                    ? "border-pink-400 ring-2 ring-pink-200"
                    : isGold
                    ? "border-amber-400"
                    : "border-gray-200"
                }`}
              >
                {/* Silver Badge */}

                {isSilver && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-pink-600 px-5 py-2 text-xs font-bold text-white shadow">
                    MOST POPULAR
                  </span>
                )}

                {/* Gold Badge */}

                {isGold && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow">
                    PREMIUM
                  </span>
                )}

                {/* Plan Header */}

                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      isGold
                        ? "bg-amber-100 text-amber-600"
                        : isSilver
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isGold ? (
                      <Crown size={25} />
                    ) : isSilver ? (
                      <Sparkles size={25} />
                    ) : (
                      <Star size={25} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {plan.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {plan.id === "free"
                        ? "Basic Membership"
                        : "Premium Membership"}
                    </p>
                  </div>
                </div>

                {/* Price */}

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ₹{plan.price}
                    </span>

                    {plan.duration > 0 && (
                      <span className="text-sm text-gray-500">
                        / {plan.duration} Months
                      </span>
                    )}
                  </div>

                  {plan.id === "free" && (
                    <p className="mt-1 text-sm text-gray-500">
                      Free forever
                    </p>
                  )}
                </div>

                <div className="mb-7 h-px bg-gray-100" />

                {/* Features */}

                <h3 className="mb-4 font-semibold text-gray-700">
                  What's Included
                </h3>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            isGold
                              ? "bg-amber-100 text-amber-600"
                              : isSilver
                              ? "bg-pink-100 text-pink-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          <Check size={13} />
                        </span>

                        {feature}
                      </li>
                    )
                  )}
                </ul>

                {/* Choose Button */}

                <button
                  onClick={() =>
                    handleChoosePlan(plan)
                  }
                  disabled={
                    isCurrentPlan ||
                    processing
                  }
                  className={`w-full rounded-xl py-3.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-green-600 ${
                    isGold
                      ? "bg-amber-500 hover:bg-amber-600"
                      : isSilver
                      ? "bg-pink-600 hover:bg-pink-700"
                      : "bg-gray-700 hover:bg-gray-800"
                  }`}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : processing
                    ? "Processing..."
                    : plan.id === "free"
                    ? "Free Membership"
                    : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* ================= PAYMENT HISTORY ================= */}

        <div className="mt-14">
          {/* Payment History Header */}

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <CreditCard size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Payment History
              </h2>

              <p className="text-sm text-gray-500">
                View your membership payments
              </p>
            </div>
          </div>

          {/* No Payments */}

          {payments.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-md">
              <CreditCard
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-semibold text-gray-600">
                No payment history yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Your membership payments will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg"
                >
                  {/* Payment Top */}

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Plan */}

                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          payment.plan ===
                          "Gold"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-pink-100 text-pink-600"
                        }`}
                      >
                        {payment.plan ===
                        "Gold" ? (
                          <Crown size={24} />
                        ) : (
                          <Sparkles
                            size={24}
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {payment.plan}{" "}
                          Membership
                        </h3>

                        <p className="text-sm text-gray-500">
                          Payment ID:{" "}
                          {payment.paymentId ||
                            "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Amount + Status */}

                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{payment.amount}
                      </p>

                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status ===
                          "Paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status ===
                              "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status ===
                          "Paid" && (
                          <CircleCheck
                            size={13}
                          />
                        )}

                        {payment.status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Details */}

                  <div className="mt-5 grid gap-3 border-t border-gray-100 pt-4 text-sm text-gray-500 md:grid-cols-3">
                    {/* Date */}

                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-pink-500"
                      />

                      <span>
                        {payment.paidAt
                          ? new Date(
                              payment.paidAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Payment pending"}
                      </span>
                    </div>

                    {/* Payment Method */}

                    <div>
                      <span className="font-medium text-gray-600">
                        Method:
                      </span>{" "}
                      {payment.paymentMethod
                        ? payment.paymentMethod.toUpperCase()
                        : "N/A"}
                    </div>

                    {/* Order ID */}

                    <div className="break-all">
                      <span className="font-medium text-gray-600">
                        Order ID:
                      </span>{" "}
                      {payment.orderId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Your perfect match is just a step
            away. ❤️
          </p>

          <p className="mt-2 text-xs text-gray-400">
            AhirwarSadi.com Membership
          </p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
