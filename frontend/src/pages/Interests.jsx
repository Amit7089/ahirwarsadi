
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Check,
  X,
  ArrowLeft,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

function Interests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

  // ===== FETCH INTERESTS =====

  const fetchInterests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/interest/received",
        { withCredentials: true }
      );

      setInterests(res.data.interests || []);
    } catch (error) {
      console.error(error);
      toast.error("Interests load nahi ho paaye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  // ===== ACCEPT / REJECT INTEREST =====

  const handleResponse = async (interestId, status) => {
    try {
      setProcessingId(interestId);

      await axios.put(
        `http://localhost:5000/api/interest/${interestId}/respond`,
        { status },
        { withCredentials: true }
      );

      await fetchInterests();

      if (status === "accepted") {
        toast.success("Interest accepted successfully ❤️", {
          duration: 6000,
          action: {
            label: "View Match",
            onClick: () => navigate("/matches"),
          },
        });
      } else {
        toast.success("Interest declined");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ===== COUNTS =====

  const pendingCount = interests.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedCount = interests.filter(
    (item) => item.status === "accepted"
  ).length;

  const filteredInterests =
    activeTab === "all"
      ? interests
      : interests.filter(
          (item) => item.status === activeTab
        );

  // ===== INITIALS =====

  const getInitials = (name) => {
    return (name || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // ===== LOADING =====

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">
            Loading your interests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9fa] text-gray-800">

      {/* ===== TOP NAVIGATION ===== */}

      <nav className="bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition"
          >
            <ArrowLeft size={19} />
            <span className="font-medium text-sm">
              Dashboard
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
              <Heart size={19} className="text-rose-600" />
            </div>

            <span className="font-bold text-gray-900">
              Ahirwar
              <span className="text-rose-600">Sadi</span>
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">

        {/* ===== PAGE HEADING ===== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-9">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <Sparkles size={14} />
              YOUR CONNECTIONS
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Received Interests
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              People who would love to connect with you.
            </p>
          </div>

          <div className="bg-white border border-rose-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
              <Heart size={23} className="text-rose-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Total received
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {interests.length}
              </p>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}

        <div className="grid grid-cols-2 gap-4 mb-8">

          <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Awaiting response
                </p>

                <h2 className="text-3xl font-bold text-amber-600 mt-2">
                  {pendingCount}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock size={21} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Accepted
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {acceptedCount}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                <Check size={21} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== FILTER TABS ===== */}

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5">
          {[
            { label: "All Interests", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
            { label: "Declined", value: "rejected" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition ${
                activeTab === tab.value
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== INTEREST CARDS ===== */}

        {filteredInterests.length === 0 ? (
          <div className="bg-white border border-rose-100 rounded-3xl py-16 px-6 text-center shadow-sm">

            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <Heart size={34} className="text-rose-400" />
            </div>

            <h2 className="text-xl font-bold mt-5 text-gray-900">
              {interests.length === 0
                ? "Your story starts here"
                : "No interests in this category"}
            </h2>

            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              {interests.length === 0
                ? "When someone sends you an interest, their profile will appear here."
                : "Try selecting another filter to see your interests."}
            </p>

            {interests.length === 0 && (
              <button
                onClick={() => navigate("/browse")}
                className="mt-6 bg-rose-600 hover:bg-rose-700 text-white px-7 py-3 rounded-xl font-semibold transition"
              >
                Explore Profiles
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {filteredInterests.map((interest) => {
              const sender = interest.sender || {};
              const isPending =
                interest.status === "pending";
              const isAccepted =
                interest.status === "accepted";
              const isProcessing =
                processingId === interest._id;

              return (
                <article
                  key={interest._id}
                  className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-rose-100/60 hover:border-rose-200 transition-all duration-300"
                >
                  <div className="p-5 sm:p-6">

                    {/* PROFILE HEADER */}

                    <div className="flex gap-4 items-start">
                      <div className="relative flex-shrink-0">

                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center">
                          {sender.profileImage ? (
                            <img
                              src={sender.profileImage}
                              alt={sender.fullName || "Profile"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-rose-600">
                              {getInitials(sender.fullName)}
                            </span>
                          )}
                        </div>

                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                          <Heart
                            size={16}
                            className="text-rose-600 fill-rose-600"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pt-1">

                        <h2 className="text-xl font-bold text-gray-900 break-words">
                          {sender.fullName || "Unknown User"}
                        </h2>

                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                          <MapPin
                            size={15}
                            className="text-rose-500 flex-shrink-0"
                          />

                          <span>
                            {[sender.city, sender.state]
                              .filter(Boolean)
                              .join(", ") ||
                              "Location not added"}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                            isAccepted
                              ? "bg-green-50 text-green-700"
                              : interest.status === "rejected"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {isAccepted ? (
                            <Check size={13} />
                          ) : interest.status === "rejected" ? (
                            <X size={13} />
                          ) : (
                            <Clock size={13} />
                          )}

                          {interest.status}
                        </span>
                      </div>
                    </div>

                    {/* PROFILE INFORMATION */}

                    <div className="grid grid-cols-2 gap-3 mt-7">

                      <div className="bg-[#fff8fa] rounded-xl p-3.5">
                        <div className="flex items-center gap-2 text-rose-600 mb-2">
                          <GraduationCap size={18} />

                          <span className="text-xs font-medium text-gray-500">
                            Education
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {sender.education || "Not specified"}
                        </p>
                      </div>

                      <div className="bg-[#fff8fa] rounded-xl p-3.5">
                        <div className="flex items-center gap-2 text-rose-600 mb-2">
                          <BriefcaseBusiness size={17} />

                          <span className="text-xs font-medium text-gray-500">
                            Profession
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {sender.profession || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* ===== ACTION BUTTONS ===== */}

                    <div className="flex flex-wrap gap-3 mt-6">

                      {/* VIEW PROFILE */}

                      <button
                        onClick={() =>
                          navigate(`/profiles/${sender._id}`)
                        }
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl py-3 font-semibold text-sm transition"
                      >
                        View Profile
                        <ChevronRight size={17} />
                      </button>

                      {/* ACCEPTED MATCH */}

                      {isAccepted && (
                        <button
                          onClick={() => navigate("/matches")}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold text-sm transition"
                        >
                          <Heart size={17} />
                          View Match
                        </button>
                      )}

                      {/* PENDING ACTIONS */}

                      {isPending && (
                        <>
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleResponse(
                                interest._id,
                                "accepted"
                              )
                            }
                            className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm transition"
                          >
                            <Check size={17} />

                            {isProcessing
                              ? "Wait..."
                              : "Accept"}
                          </button>

                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              handleResponse(
                                interest._id,
                                "rejected"
                              )
                            }
                            className="w-12 flex-shrink-0 flex items-center justify-center border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition disabled:opacity-50"
                            title="Decline"
                          >
                            <X size={19} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Interests;
