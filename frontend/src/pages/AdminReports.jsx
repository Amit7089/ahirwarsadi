
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
  AlertTriangle,
  RefreshCw,
  User,
  Calendar,
  FileText,
  ArrowLeft,
  CheckCircle,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";

const API = "https://ahirwarsadi-api.onrender.com/api/admin";

const AdminReports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [blockingId, setBlockingId] = useState(null);
  const [notes, setNotes] = useState({});

  const fetchReports = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/reports`, {
        params: { status: statusFilter },
        withCredentials: true,
      });

      setReports(res.data.reports || []);

      const savedNotes = {};

      (res.data.reports || []).forEach((report) => {
        savedNotes[report._id] = report.adminNote || "";
      });

      setNotes((prev) => ({
        ...savedNotes,
        ...prev,
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const updateReport = async (id, status) => {
    try {
      setUpdatingId(id);

      const adminNote = notes[id] || "";

      const res = await axios.patch(
        `${API}/reports/${id}`,
        { status, adminNote },
        { withCredentials: true }
      );

      toast.success(
        res.data.message || "Report updated successfully"
      );

      await fetchReports();
    } catch (error) {
      console.error("Update Report Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update report"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Block / Unblock reported user
  const toggleBlockUser = async (userId) => {
    if (!userId) {
      toast.error("Reported user not found");
      return;
    }

    try {
      setBlockingId(userId);

      const res = await axios.patch(
        `${API}/users/${userId}/block`,
        {},
        { withCredentials: true }
      );

      toast.success(
        res.data.message || "User status updated successfully"
      );

      await fetchReports();
    } catch (error) {
      console.error("Toggle Block Error:", error);

      toast.error(
        error.response?.data?.message || "Unable to update user status"
      );
    } finally {
      setBlockingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN");
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-pink-600">
              AhirwarSadi.com
            </p>

            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 md:text-3xl">
              <AlertTriangle className="text-red-500" />
              Reports & Complaints
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage user complaints and reported profiles.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <button
              onClick={fetchReports}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filter by Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-pink-500 sm:w-64"
          >
            <option value="All">All Reports</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Reports */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border bg-white py-16 text-center shadow-sm">
            <FileText className="mx-auto mb-3 text-gray-400" size={40} />

            <h2 className="font-semibold text-gray-700">
              No Reports Found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              There are no reports under this status.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reports.map((report) => {
              const reportedUser = report.reportedUser;
              const isBlocked = reportedUser?.isBlocked === true;

              return (
                <div
                  key={report._id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col gap-3 border-b bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={19} />

                      <span className="font-semibold text-gray-800">
                        {report.reason}
                      </span>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="grid gap-5 p-4 md:grid-cols-2">

                    {/* Reporter */}
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-700">
                        <User size={17} />
                        Reported By
                      </h3>

                      <p className="font-medium text-gray-800">
                        {report.reportedBy?.fullName || "Deleted User"}
                      </p>

                      <p className="break-all text-sm text-gray-500">
                        {report.reportedBy?.email || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {report.reportedBy?.phone || "N/A"}
                      </p>
                    </div>

                    {/* Reported User */}
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-700">
                        <User size={17} />
                        Reported Profile
                      </h3>

                      <p className="font-medium text-gray-800">
                        {reportedUser?.fullName || "Deleted User"}
                      </p>

                      <p className="break-all text-sm text-gray-500">
                        {reportedUser?.email || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {reportedUser?.phone || "N/A"}
                      </p>

                      {reportedUser && (
                        <div className="mt-4">
                          <p className="mb-2 text-sm font-medium text-gray-600">
                            Account Status:{" "}
                            <span className={isBlocked ? "text-red-600" : "text-green-600"}>
                              {isBlocked ? "Blocked" : "Active"}
                            </span>
                          </p>

                          <button
                            onClick={() => toggleBlockUser(reportedUser._id)}
                            disabled={blockingId === reportedUser._id}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50 ${
                              isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {blockingId === reportedUser._id ? (
                              "Updating..."
                            ) : isBlocked ? (
                              <>
                                <ShieldCheck size={16} />
                                Unblock User
                              </>
                            ) : (
                              <>
                                <ShieldBan size={16} />
                                Block User
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Complaint Description */}
                  <div className="px-4 pb-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                        <FileText size={17} />
                        Complaint Description
                      </h3>

                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {report.description || "No description provided."}
                      </p>

                      <p className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} />
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Admin Action */}
                  <div className="border-t p-4">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Admin Note
                    </label>

                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={notes[report._id] ?? report.adminNote ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [report._id]: e.target.value,
                        }))
                      }
                      placeholder="Write reason for resolving or rejecting this report..."
                      className="w-full rounded-lg border p-3 text-sm outline-none focus:border-pink-500"
                    />

                    <p className="mt-1 text-right text-xs text-gray-400">
                      {(notes[report._id] || "").length}/1000
                    </p>

                    {/* Status Buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[
                        "Under Review",
                        "Resolved",
                        "Rejected",
                      ].map((status) => (
                        <button
                          key={status}
                          disabled={updatingId === report._id}
                          onClick={() => updateReport(report._id, status)}
                          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                            status === "Resolved"
                              ? "bg-green-600 hover:bg-green-700"
                              : status === "Rejected"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {updatingId === report._id ? (
                            "Updating..."
                          ) : (
                            <>
                              <CheckCircle size={15} />
                              {status}
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
