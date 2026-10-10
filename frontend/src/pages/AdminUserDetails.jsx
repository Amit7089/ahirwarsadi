
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  LayoutDashboard,
  UserRound,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  BriefcaseBusiness,
  IndianRupee,
  Ruler,
  CalendarDays,
  ShieldCheck,
  Heart,
  LoaderCircle,
} from "lucide-react";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `https://ahirwarsadi-api.onrender.com/api/admin/users/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("User Details Error:", err);
        setError(
          err.response?.data?.message || "Unable to load user details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const month = today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <div className="rounded-lg bg-white p-2 text-pink-600 shadow-sm">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  // Common Navigation Buttons
  const NavigationButtons = () => (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
      >
        <ArrowLeft size={18} />
        Back to Users
      </button>

      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
      >
        <LayoutDashboard size={18} />
        Admin Dashboard
      </button>
    </div>
  );

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50">
        <LoaderCircle className="animate-spin text-pink-600" size={36} />

        <p className="text-sm text-gray-500">
          Loading user details...
        </p>

        <NavigationButtons />
      </div>
    );
  }

  // Error
  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50 p-4">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <UserRound
            size={40}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-lg font-bold text-gray-800">
            User Details Not Found
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "User not found"}
          </p>
        </div>

        <NavigationButtons />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-pink-600">
              AhirwarSadi.com
            </p>

            <h1 className="mt-1 text-xl font-bold text-gray-900">
              Member Details
            </h1>
          </div>

          <NavigationButtons />
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500" />

          <div className="px-6 pb-7 sm:px-8">

            {/* Profile Image and Status */}
            <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-28 w-28 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-pink-100 text-pink-600 shadow-md">
                  <UserRound size={42} />
                </div>
              )}

              <div className="mb-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    user.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isVerified
                    ? "Verified"
                    : "Verification Pending"}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    user.profileCompleted
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.profileCompleted
                    ? "Profile Complete"
                    : "Profile Incomplete"}
                </span>
              </div>
            </div>

            {/* Name */}
            <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
              {user.fullName}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} />

              {[user.city, user.state].filter(Boolean).join(", ") ||
                "Location not provided"}
            </p>

            {/* Personal Information */}
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={user.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone"
                  value={user.phone}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Age"
                  value={
                    user.dateOfBirth
                      ? `${calculateAge(user.dateOfBirth)} years`
                      : "N/A"
                  }
                />

                <InfoItem
                  icon={UserRound}
                  label="Gender"
                  value={user.gender}
                />

                <InfoItem
                  icon={Ruler}
                  label="Height"
                  value={user.height}
                />

                <InfoItem
                  icon={Heart}
                  label="Marital Status"
                  value={user.maritalStatus}
                />

                <InfoItem
                  icon={GraduationCap}
                  label="Education"
                  value={user.education}
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Profession"
                  value={user.profession}
                />

                <InfoItem
                  icon={IndianRupee}
                  label="Annual Income"
                  value={user.annualIncome}
                />

                <InfoItem
                  icon={ShieldCheck}
                  label="Account Role"
                  value={user.role}
                />
              </div>
            </div>

            {/* About Me */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-gray-900">
                About Me
              </h2>

              <div className="rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-600">
                {user.aboutMe ||
                  "No introduction provided by this member."}
              </div>
            </div>

            {/* Partner Preferences */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold text-gray-900">
                Partner Preferences
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={CalendarDays}
                  label="Preferred Age"
                  value={
                    user.partnerPreferences
                      ? `${user.partnerPreferences.minAge || "Any"} - ${
                          user.partnerPreferences.maxAge || "Any"
                        } years`
                      : "Not provided"
                  }
                />

                <InfoItem
                  icon={GraduationCap}
                  label="Preferred Education"
                  value={user.partnerPreferences?.education}
                />

                <InfoItem
                  icon={BriefcaseBusiness}
                  label="Preferred Profession"
                  value={user.partnerPreferences?.profession}
                />

                <InfoItem
                  icon={MapPin}
                  label="Preferred City"
                  value={user.partnerPreferences?.city}
                />
              </div>
            </div>

            {/* Photo Gallery */}
            {user.photoGallery?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-bold text-gray-900">
                  Photo Gallery
                </h2>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {user.photoGallery.map((photo, index) => (
                    <img
                      key={index}
                      src={
                        typeof photo === "string"
                          ? photo
                          : photo.url
                      }
                      alt={`Gallery ${index + 1}`}
                      className="h-48 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            <div className="mt-8 border-t pt-6">
              <NavigationButtons />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;