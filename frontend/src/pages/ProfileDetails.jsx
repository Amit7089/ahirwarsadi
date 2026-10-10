
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Heart,
  Images,
  X,
  Flag,
  Send,
} from "lucide-react";

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/${id}`,
          { withCredentials: true }
        );

        setProfile(response.data.profile);
      } catch (err) {
        setError(
          err.response?.data?.message || "Profile load nahi ho payi"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a report reason");
      return;
    }

    try {
      setReportLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/reports",
        {
          reportedUserId: id,
          reason,
          description,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Report submitted successfully");

        setShowReportModal(false);
        setReason("");
        setDescription("");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Report submit nahi ho payi"
      );
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/browse")}
          className="mt-4 rounded-lg bg-pink-600 px-5 py-2 text-white"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate("/browse")}
          className="mb-5 flex items-center gap-2 text-pink-700"
        >
          <ArrowLeft size={20} />
          Back to Browse
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-400 p-8 text-center text-white">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.fullName}
                className="mx-auto h-32 w-32 rounded-full border-4 border-white object-cover"
                style={{ objectPosition: "center 5%" }}
              />
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl font-bold text-pink-600">
                {profile.fullName?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <h1 className="mt-4 text-3xl font-bold">
              {profile.fullName}
            </h1>

            <p className="mt-2">
              {profile.age ? `${profile.age} years` : "Age not provided"}
              {profile.height ? ` • ${profile.height}` : ""}
            </p>

            <p className="mt-2 flex items-center justify-center gap-2">
              <MapPin size={18} />
              {[profile.city, profile.state].filter(Boolean).join(", ") ||
                "Location not provided"}
            </p>
          </div>

          <div className="space-y-6 p-6">

            {/* Photo Gallery */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Images className="text-pink-600" />
                Photo Gallery
              </h2>

              {profile.photoGallery?.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {profile.photoGallery.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(photo)}
                      className="group overflow-hidden rounded-xl bg-gray-100"
                    >
                      <img
                        src={photo}
                        alt={`Gallery photo ${index + 1}`}
                        className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
                  <Images size={35} className="mx-auto mb-2 text-gray-400" />
                  No gallery photos uploaded yet.
                </div>
              )}
            </section>

            <hr />

            {/* Personal Details */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Heart className="text-pink-600" />
                Personal Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Gender" value={profile.gender} />
                <Detail
                  label="Age"
                  value={profile.age ? `${profile.age} years` : ""}
                />
                <Detail label="Height" value={profile.height} />
                <Detail label="Marital Status" value={profile.maritalStatus} />
                <Detail label="City" value={profile.city} />
                <Detail label="State" value={profile.state} />
              </div>
            </section>

            <hr />

            {/* Education & Career */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
                <GraduationCap className="text-pink-600" />
                Education & Career
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Education" value={profile.education} />
                <Detail label="Profession" value={profile.profession} />
                <Detail label="Annual Income" value={profile.annualIncome} />
              </div>
            </section>

            <hr />

            {/* About Me */}
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-800">
                <Briefcase className="text-pink-600" />
                About Me
              </h2>

              <p className="whitespace-pre-wrap leading-7 text-gray-600">
                {profile.aboutMe || "No introduction added yet."}
              </p>
            </section>

            {/* Report Profile */}
            <hr />

            <div className="flex justify-end">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Flag size={17} />
                Report Profile
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Report Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Report {profile.fullName}'s profile
                </p>
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Reason for reporting *
                </label>

                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
                >
                  <option value="">Select a reason</option>
                  <option value="Fake Profile">Fake Profile</option>
                  <option value="Wrong Information">Wrong Information</option>
                  <option value="Inappropriate Photos">Inappropriate Photos</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Scam or Fraud">Scam or Fraud</option>
                  <option value="Already Married">Already Married</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Additional Details
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="Please explain the issue..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {description.length}/1000
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-3 text-xs leading-5 text-yellow-800">
                Please submit genuine reports only. Our admin team will review your complaint.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={reportLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
                >
                  <Send size={16} />
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Full Screen Photo Preview */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white"
          >
            <X size={28} />
          </button>

          <img
            src={selectedPhoto}
            alt="Selected gallery"
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-lg bg-gray-50 p-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-semibold text-gray-800">
      {value || "Not provided"}
    </p>
  </div>
);

export default ProfileDetails;
