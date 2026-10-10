
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  Heart,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  ArrowLeft,
  UserRound,
  RefreshCw,
  Eye,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";

const API = "https://ahirwarsadi-api.onrender.com/api";

const Matches = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingContact, setLoadingContact] = useState(null);
  const [contacts, setContacts] = useState({});

  // Safely convert MongoDB IDs or populated user objects to strings.
  const getId = (value) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      if (value._id) return String(value._id);
      if (value.id) return String(value.id);
      if (value.$oid) return String(value.$oid);
    }

    return "";
  };

  // Get the other user's profile from a match.
  const getOtherUser = useCallback(
    (match) => {
      if (!match) return null;

      const users = Array.isArray(match.users)
        ? match.users
        : [];

      if (users.length > 0) {
        const otherUser = users.find((user) => {
          const id = getId(user);
          return id && id !== currentUserId;
        });

        if (otherUser) {
          return typeof otherUser === "object"
            ? otherUser
            : { _id: otherUser };
        }
      }

      // Support alternate response shapes if the API returns them.
      const possibleUsers = [
        match.user,
        match.otherUser,
        match.profile,
        match.matchedUser,
        match.receiver,
        match.sender,
      ];

      for (const candidate of possibleUsers) {
        if (!candidate) continue;

        const candidateId = getId(candidate);

        if (
          candidateId &&
          candidateId !== currentUserId
        ) {
          return typeof candidate === "object"
            ? candidate
            : { _id: candidate };
        }
      }

      return null;
    },
    [currentUserId]
  );

  // Fetch matches.
  const fetchMatches = async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await axios.get(
        `${API}/match`,
        {
          withCredentials: true,
        }
      );

      const data = response.data || {};

      const fetchedMatches = Array.isArray(data.matches)
        ? data.matches
        : [];

      setMatches(fetchedMatches);

      // Adjust these fallbacks if your backend uses another field.
      const loggedInUserId = getId(
        data.currentUserId ||
          data.userId ||
          data.user?._id ||
          data.currentUser?._id
      );

      if (loggedInUserId) {
        setCurrentUserId(loggedInUserId);
      }
    } catch (error) {
      console.error("Fetch Matches Error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Unable to load matches"
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Open the correct profile.
  const handleViewProfile = (match) => {
    const otherUser = getOtherUser(match);
    const profileId = getId(otherUser);

    console.log("Selected match:", match);
    console.log("Other user:", otherUser);
    console.log("Profile ID:", profileId);

    if (!profileId) {
      toast.error(
        "Profile ID not found. Please refresh matches."
      );
      return;
    }

    // Same route used by the Browse page.
    navigate(`/profiles/${profileId}`);
  };

  // Open chat.
  const handleOpenChat = (match) => {
    if (!match?._id) {
      toast.error("Chat is not available for this match");
      return;
    }

    navigate(`/chat/${match._id}`);
  };

  // Fetch contact details.
  const handleShowContact = async (userId) => {
    if (!userId) {
      toast.error("Profile details not available");
      return;
    }

    try {
      setLoadingContact(userId);

      const response = await axios.get(
        `${API}/contact/${userId}`,
        {
          withCredentials: true,
        }
      );

      const contactData =
        response.data?.contact ||
        response.data?.data ||
        response.data;

      setContacts((prev) => ({
        ...prev,
        [userId]: contactData,
      }));

      toast.success("Contact details loaded");
    } catch (error) {
      console.error("Contact Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load contact details"
      );
    } finally {
      setLoadingContact(null);
    }
  };

  const getAge = (user) => {
    if (user?.age !== undefined && user?.age !== null) {
      return user.age;
    }

    if (!user?.dateOfBirth) return null;

    const dob = new Date(user.dateOfBirth);

    if (Number.isNaN(dob.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();

    const monthDifference =
      today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getContactText = (contact) => {
    if (!contact) return "";

    if (typeof contact === "string") {
      return contact;
    }

    return (
      contact.phone ||
      contact.mobile ||
      contact.phoneNumber ||
      contact.email ||
      ""
    );
  };

  // Loading screen.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
          <p className="font-semibold text-gray-600">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-rose-100 bg-white/90 shadow-sm backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
              <Heart size={23} fill="currentColor" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                Ahirwar<span className="text-rose-600">Sadi</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-widest text-gray-500">
                FIND YOUR PERFECT MATCH
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-rose-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-600">
            <Sparkles size={16} />
            Your Connections
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Matches <span className="text-rose-500">❤️</span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover people you have connected with and explore
            their profiles.
          </p>
        </div>

        {/* Results summary */}
        <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">
              Total Matches
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your connections in one place.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-rose-100 px-4 py-2 text-sm font-extrabold text-rose-600">
              {matches.length}{" "}
              {matches.length === 1 ? "Match" : "Matches"}
            </span>

            <button
              onClick={() => fetchMatches(false)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Empty state */}
        {matches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-400">
              <Heart size={40} />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900">
              No Matches Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Keep exploring profiles and connecting with people
              to grow your matches.
            </p>

            <button
              onClick={() => navigate("/browse")}
              className="mt-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-pink-700"
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          /* Match cards */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
              const otherUser = getOtherUser(match);
              const userId = getId(otherUser);

              const name =
                otherUser?.fullName ||
                otherUser?.name ||
                "Member";

              const age = getAge(otherUser);

              const location = [
                otherUser?.city,
                otherUser?.state,
              ]
                .filter(Boolean)
                .join(", ");

              const contact = contacts[userId];
              const contactText = getContactText(contact);

              return (
                <article
                  key={match._id || userId}
                  className="group overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Profile image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-200">
                    {otherUser?.profileImage ? (
                      <img
                        src={otherUser.profileImage}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-rose-300">
                        <UserRound size={84} />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                      <h3 className="truncate text-xl font-extrabold text-white">
                        {name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-white/90">
                        {age !== null && age !== undefined
                          ? `${age} years`
                          : "Age not provided"}

                        {otherUser?.height
                          ? ` • ${otherUser.height}`
                          : ""}
                      </p>
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-600 shadow">
                      <Heart
                        size={13}
                        className="mr-1 inline"
                        fill="currentColor"
                      />
                      Connected
                    </div>
                  </div>

                  {/* Profile details */}
                  <div className="p-5">
                    <div className="space-y-3 text-sm text-gray-600">
                      {otherUser?.education && (
                        <div className="flex items-center gap-3">
                          <GraduationCap
                            size={19}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {otherUser.education}
                          </span>
                        </div>
                      )}

                      {otherUser?.profession && (
                        <div className="flex items-center gap-3">
                          <BriefcaseBusiness
                            size={18}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {otherUser.profession}
                          </span>
                        </div>
                      )}

                      {location && (
                        <div className="flex items-center gap-3">
                          <MapPin
                            size={18}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact details */}
                    {contactText && (
                      <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                        <p className="text-xs font-bold text-emerald-700">
                          Contact Details
                        </p>
                        <p className="mt-1 break-words text-sm text-emerald-800">
                          {contactText}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleViewProfile(match)}
                        disabled={!userId}
                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Eye size={17} />
                        View Profile
                      </button>

                      <button
                        onClick={() => handleOpenChat(match)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-sm font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-pink-700"
                      >
                        <MessageCircle size={17} />
                        Chat
                      </button>
                    </div>

                    <button
                      onClick={() => handleShowContact(userId)}
                      disabled={!userId || loadingContact === userId}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Phone size={17} />
                      {loadingContact === userId
                        ? "Loading Contact..."
                        : "View Contact"}
                    </button>

                    {!userId && (
                      <p className="mt-3 text-center text-xs text-red-500">
                        User ID missing in match data. Check the browser
                        console and backend response.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-14 border-t border-rose-100 py-6 text-center">
          <p className="text-sm text-gray-500">
            Made with{" "}
            <Heart
              size={14}
              className="mx-1 inline text-rose-500"
              fill="currentColor"
            />{" "}
            for meaningful connections.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            © {new Date().getFullYear()} AhirwarSadi. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Matches;
