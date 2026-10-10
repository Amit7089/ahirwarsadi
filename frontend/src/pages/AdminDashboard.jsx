
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Users,
  UserCheck,
  UserRoundCheck,
  UserRound,
  RefreshCw,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  AlertTriangle,
  FileText,
  Home,
  UserCog,
  CreditCard,
  IndianRupee,
  Crown,
  Sparkles,
  CircleCheck,
  ArrowUpRight,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ================= USER STATS =================

  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    verifiedUsers: 0,
    completedProfiles: 0,
  });

  // ================= REPORT STATS =================

  const [reportStats, setReportStats] = useState({
    total: 0,
    pending: 0,
  });

  // ================= PAYMENT STATS =================

  const [paymentStats, setPaymentStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    silverPayments: 0,
    goldPayments: 0,
  });

  // ================= DATA =================

  const [recentUsers, setRecentUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  // ================= LOADING =================

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [paymentError, setPaymentError] =
    useState("");

  // ================= DASHBOARD API =================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setStats(res.data.stats);
        setRecentUsers(
          res.data.recentUsers || []
        );
      }
    } catch (err) {
      console.error(
        "Admin Dashboard Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Dashboard load nahi ho paya"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REPORT API =================

  const fetchReportStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/reports",
        {
          withCredentials: true,
        }
      );

      const reports =
        res.data.reports || [];

      setReportStats({
        total: reports.length,
        pending: reports.filter(
          (report) =>
            report.status === "Pending"
        ).length,
      });
    } catch (err) {
      console.error(
        "Reports Count Error:",
        err
      );
    }
  };

  // ================= PAYMENT API =================

  const fetchPayments = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      const res = await axios.get(
        "http://localhost:5000/api/admin/payments",
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setPaymentStats(
          res.data.stats || {}
        );

        setPayments(
          res.data.payments || []
        );
      }
    } catch (err) {
      console.error(
        "Admin Payments Error:",
        err
      );

      setPaymentError(
        err.response?.data?.message ||
          "Payment data load nahi ho paya"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ================= REFRESH =================

  const handleRefresh = () => {
    fetchDashboard();
    fetchReportStats();
    fetchPayments();
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchDashboard();
    fetchReportStats();
    fetchPayments();
  }, []);

  // ================= USER CARDS =================

  const userCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Male Members",
      value: stats.maleUsers,
      icon: UserRound,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Female Members",
      value: stats.femaleUsers,
      icon: UserCheck,
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
    {
      title: "Verified",
      value: stats.verifiedUsers,
      icon: ShieldCheck,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Completed Profiles",
      value: stats.completedProfiles,
      icon: UserRoundCheck,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  // ================= PAYMENT CARDS =================

  const paymentCards = [
    {
      title: "Total Revenue",
      value: `₹${paymentStats.totalRevenue || 0}`,
      icon: IndianRupee,
      bg: "from-pink-600 to-purple-600",
      light: "bg-white/15",
    },
    {
      title: "Total Payments",
      value: paymentStats.totalPayments || 0,
      icon: CreditCard,
      bg: "from-blue-600 to-indigo-600",
      light: "bg-white/15",
    },
    {
      title: "Silver Sales",
      value: paymentStats.silverPayments || 0,
      icon: Sparkles,
      bg: "from-pink-500 to-rose-500",
      light: "bg-white/15",
    },
    {
      title: "Gold Sales",
      value: paymentStats.goldPayments || 0,
      icon: Crown,
      bg: "from-amber-500 to-orange-500",
      light: "bg-white/15",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7fb]">

      {/* ================= TOP HEADER ================= */}

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-200">
                <Crown size={27} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>

                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                    Live
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  AhirwarSadi.com platform overview
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() =>
                  navigate("/")
                }
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <Home size={16} />
                Website
              </button>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <UserCog size={16} />
                Users
              </button>

              <button
                onClick={handleRefresh}
                disabled={
                  loading ||
                  paymentLoading
                }
                className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading ||
                    paymentLoading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        {/* ================= WELCOME BANNER ================= */}

        <div className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-6 text-white shadow-xl shadow-pink-100 sm:p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>
              <p className="mb-2 text-sm font-medium text-pink-100">
                Welcome back, Admin 👋
              </p>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Manage your matrimonial platform
              </h2>

              <p className="mt-2 max-w-xl text-sm text-pink-100">
                Monitor members, memberships,
                payments and reported profiles
                from one place.
              </p>
            </div>

            <div className="hidden h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm md:flex">
              <TrendingUp size={42} />
            </div>

          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {paymentError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {paymentError}
          </div>
        )}

        {/* ================= QUICK STATS ================= */}

        <div className="mb-8">

          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Platform Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Member statistics
              </p>
            </div>

            <span className="hidden text-xs font-medium text-gray-400 sm:block">
              All time
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {userCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                    >
                      <Icon size={21} />
                    </div>

                    <ArrowUpRight
                      size={17}
                      className="text-gray-300 transition group-hover:text-pink-500"
                    />

                  </div>

                  <p className="mt-5 text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {loading
                      ? "..."
                      : card.value}
                  </p>

                </div>
              );
            })}

          </div>
        </div>

        {/* ================= PAYMENT SECTION ================= */}

        <div className="mb-8">

          <div className="mb-4 flex items-end justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Revenue & Memberships
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Track your membership business
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600 sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Payments Active
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {paymentCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-5 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
                >

                  <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />

                  <div className="relative">

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.light}`}
                    >
                      <Icon size={21} />
                    </div>

                    <p className="mt-5 text-sm font-medium text-white/80">
                      {card.title}
                    </p>

                    <p className="mt-1 text-3xl font-bold">
                      {paymentLoading
                        ? "..."
                        : card.value}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ================= SALES BREAKDOWN ================= */}

        <div className="mb-8 grid gap-6 lg:grid-cols-3">

          {/* Revenue Summary */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-bold text-gray-900">
                  Membership Sales
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Silver vs Gold memberships
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-2.5 text-gray-600">
                <WalletCards size={20} />
              </div>

            </div>

            <div className="mt-7 space-y-6">

              {/* Silver */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                      <Sparkles size={16} />
                    </span>

                    <span className="text-sm font-semibold text-gray-700">
                      Silver Membership
                    </span>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    {paymentStats.silverPayments || 0}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-pink-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-600 transition-all"
                    style={{
                      width:
                        paymentStats.totalPayments > 0
                          ? `${
                              (paymentStats.silverPayments /
                                paymentStats.totalPayments) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

              </div>

              {/* Gold */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Crown size={16} />
                    </span>

                    <span className="text-sm font-semibold text-gray-700">
                      Gold Membership
                    </span>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    {paymentStats.goldPayments || 0}
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-amber-50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                    style={{
                      width:
                        paymentStats.totalPayments > 0
                          ? `${
                              (paymentStats.goldPayments /
                                paymentStats.totalPayments) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>

              </div>

            </div>
          </div>

          {/* Reports */}

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <AlertTriangle
                  size={21}
                />
              </div>

              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                {reportStats.pending} Pending
              </span>

            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-900">
              Reports & Complaints
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review reported profiles and
              manage user complaints.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-xl bg-gray-50 p-3">

              <span className="text-sm text-gray-500">
                Total Reports
              </span>

              <span className="font-bold text-gray-900">
                {reportStats.total}
              </span>

            </div>

            <button
              onClick={() =>
                navigate("/admin/reports")
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <FileText size={16} />
              Manage Reports
            </button>

          </div>

        </div>

        {/* ================= PAYMENT HISTORY ================= */}

        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <CreditCard size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Recent Payments
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest successful membership transactions
                </p>
              </div>

            </div>

            <span className="w-fit rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
              {payments.length} Transactions
            </span>

          </div>

          {paymentLoading ? (
            <div className="p-10 text-center text-gray-500">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-10 text-center">

              <CreditCard
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-semibold text-gray-600">
                No payments yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Successful membership payments
                will appear here.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead className="bg-gray-50">

                  <tr className="text-xs uppercase tracking-wide text-gray-400">

                    <th className="px-5 py-4">
                      Member
                    </th>

                    <th className="px-5 py-4">
                      Plan
                    </th>

                    <th className="px-5 py-4">
                      Amount
                    </th>

                    <th className="px-5 py-4">
                      Method
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {payments.map(
                    (payment) => {

                      const user =
                        payment.userId;

                      return (
                        <tr
                          key={
                            payment._id
                          }
                          className="transition hover:bg-gray-50"
                        >

                          {/* Member */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-purple-100 font-bold text-pink-600">
                                {user?.fullName
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "U"}
                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  {user?.fullName ||
                                    "Unknown User"}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-400">
                                  {user?.email ||
                                    "N/A"}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* Plan */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                payment.plan ===
                                "Gold"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >

                              {payment.plan ===
                              "Gold" ? (
                                <Crown
                                  size={13}
                                />
                              ) : (
                                <Sparkles
                                  size={13}
                                />
                              )}

                              {payment.plan}

                            </span>

                          </td>

                          {/* Amount */}

                          <td className="px-5 py-4">

                            <p className="font-bold text-gray-900">
                              ₹
                              {
                                payment.amount
                              }
                            </p>

                          </td>

                          {/* Method */}

                          <td className="px-5 py-4">

                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                              {payment.paymentMethod
                                ? payment.paymentMethod.toUpperCase()
                                : "N/A"}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                              <CircleCheck
                                size={13}
                              />

                              Paid
                            </span>

                          </td>

                          {/* Date */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <CalendarDays
                                size={15}
                                className="text-pink-500"
                              />

                              {payment.paidAt
                                ? new Date(
                                    payment.paidAt
                                  ).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month:
                                        "short",
                                      year:
                                        "numeric",
                                    }
                                  )
                                : "N/A"}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>
              </table>

            </div>
          )}

        </div>

        {/* ================= RECENT USERS ================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Users size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Recent Members
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Latest registered users
                </p>
              </div>

            </div>

            <span className="w-fit rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-600">
              {recentUsers.length} Members
            </span>

          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="bg-gray-50">

                  <tr className="text-xs uppercase tracking-wide text-gray-400">

                    <th className="px-5 py-4">
                      Member
                    </th>

                    <th className="px-5 py-4">
                      Contact
                    </th>

                    <th className="px-5 py-4">
                      Location
                    </th>

                    <th className="px-5 py-4">
                      Gender
                    </th>

                    <th className="px-5 py-4">
                      Verification
                    </th>

                    <th className="px-5 py-4">
                      Profile
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {recentUsers.map(
                    (user) => (
                      <tr
                        key={
                          user._id
                        }
                        className="transition hover:bg-gray-50"
                      >

                        {/* Member */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600">
                              {user.fullName
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "U"}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {
                                  user.fullName
                                }
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                                <CalendarDays
                                  size={11}
                                />

                                {user.createdAt
                                  ? new Date(
                                      user.createdAt
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "N/A"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="px-5 py-4">

                          <p className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail
                              size={13}
                              className="text-gray-400"
                            />

                            {user.email}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                            <Phone
                              size={12}
                            />

                            {user.phone ||
                              "N/A"}
                          </p>

                        </td>

                        {/* Location */}

                        <td className="px-5 py-4 text-sm text-gray-600">

                          <div className="flex items-center gap-1.5">

                            <MapPin
                              size={14}
                              className="text-pink-500"
                            />

                            {[
                              user.city,
                              user.state,
                            ]
                              .filter(Boolean)
                              .join(
                                ", "
                              ) ||
                              "N/A"}

                          </div>

                        </td>

                        {/* Gender */}

                        <td className="px-5 py-4">

                          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                            {user.gender ||
                              "N/A"}
                          </span>

                        </td>

                        {/* Verification */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              user.isVerified
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {user.isVerified
                              ? "Verified"
                              : "Pending"}
                          </span>

                        </td>

                        {/* Profile */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              user.profileCompleted
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.profileCompleted
                              ? "Complete"
                              : "Incomplete"}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>

            </div>
          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="py-8 text-center">

          <p className="text-xs text-gray-400">
            © 2026 AhirwarSadi.com
          </p>

          <p className="mt-1 text-xs text-gray-300">
            Admin Management Panel
          </p>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
