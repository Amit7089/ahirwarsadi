
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Users,
  UserRound,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Ban,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [verified, setVerified] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:5000/api/admin/users", {
        params: {
          search,
          gender,
          verified,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Admin Users Error:", err);
      setError(err.response?.data?.message || "Users load nahi ho paye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, gender, verified]);

  const handleBlockUser = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} ${user.fullName}?`
    );

    if (!confirmAction) return;

    try {
      setUpdatingId(user._id);

      const res = await axios.patch(
        `http://localhost:5000/api/admin/users/${user._id}/block`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  isBlocked: res.data.isBlocked,
                }
              : u
          )
        );

        toast.success(
          res.data.message ||
            `User ${res.data.isBlocked ? "blocked" : "unblocked"} successfully`
        );
      }
    } catch (err) {
      console.error("Block User Error:", err);

      toast.error(
        err.response?.data?.message || "User status update nahi ho paya"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyUser = async (user) => {
    const action = user.isVerified ? "unverify" : "verify";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} ${user.fullName}?`
    );

    if (!confirmAction) return;

    try {
      setUpdatingId(user._id);

      const res = await axios.patch(
        `http://localhost:5000/api/admin/users/${user._id}/verify`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id
              ? { ...u, isVerified: res.data.isVerified }
              : u
          )
        );

        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Verification update nahi ho paya"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${user.fullName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setUpdatingId(user._id);

      const res = await axios.delete(
        `http://localhost:5000/api/admin/users/${user._id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setUsers((prevUsers) =>
          prevUsers.filter((u) => u._id !== user._id)
        );

        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "User delete nahi ho paya"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-pink-600">
              AhirwarSadi.com
            </p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage all registered members
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Back to Dashboard */}
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
            >
              ← Back to Dashboard
            </button>

            {/* Refresh */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-pink-100 p-3 text-pink-600">
                <Users size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Members</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {users.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.isVerified).length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <UserRound size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Incomplete Profiles</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => !u.profileCompleted).length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-pink-500"
            />
          </div>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={verified}
            onChange={(e) => setVerified(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-pink-500"
          >
            <option value="All">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Pending</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-bold text-gray-900">
              Registered Members ({users.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Member</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Gender</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Profile</th>
                    <th className="px-5 py-4">Account</th>
                    <th className="px-5 py-4">Action</th>
                    <th className="px-5 py-4">Verification Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">

                      {/* Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.fullName}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                              <UserRound size={20} />
                            </div>
                          )}

                          <div>
                            <button
                              onClick={() =>
                                navigate(`/admin/users/${user._id}`)
                              }
                              className="text-left font-semibold text-gray-900 hover:text-pink-600"
                            >
                              {user.fullName}
                            </button>

                            <p className="text-xs text-gray-400">
                              Joined{" "}
                              {new Date(user.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-600">
                          <Mail size={13} className="mr-1 inline" />
                          {user.email}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          <Phone size={13} className="mr-1 inline" />
                          {user.phone || "N/A"}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <MapPin size={14} className="mr-1 inline" />
                        {[user.city, user.state].filter(Boolean).join(", ") ||
                          "N/A"}
                      </td>

                      {/* Gender */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {user.gender || "N/A"}
                      </td>

                      {/* Verification */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      {/* Profile */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.profileCompleted
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.profileCompleted ? "Complete" : "Incomplete"}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Verification Action */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleVerifyUser(user)}
                          disabled={updatingId === user._id}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-50 ${
                            user.isVerified
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {updatingId === user._id
                            ? "Updating..."
                            : user.isVerified
                              ? "Unverify"
                              : "Verify"}
                        </button>
                      </td>

                      {/* Block / Unblock / Delete */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleBlockUser(user)}
                          disabled={updatingId === user._id}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            user.isBlocked
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {updatingId === user._id ? (
                            "Updating..."
                          ) : user.isBlocked ? (
                            <>
                              <CheckCircle size={15} />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban size={15} />
                              Block
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={updatingId === user._id}
                          className="mt-2 flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;