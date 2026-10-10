import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

import Navbar from "../components/Navbar";

import {
  Heart,
  User,
  Search,
  Settings,
  Users,
  ShieldCheck,
  Mail,
  Sparkles,
  MessageCircle,
  ArrowRight,
  UserRound,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const API = "https://ahirwarsadi-api.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [completion, setCompletion] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setProfileLoading(true);
    setMatchesLoading(true);

    try {
      const profileResult = await axios
        .get(`${API}/api/profile/me`, {
          withCredentials: true,
        })
        .catch((error) => {
          console.error("My Profile API Error:", error);
          return null;
        });

      const matchesResult = await axios
        .get(`${API}/api/profile/all`, {
          withCredentials: true,
        })
        .catch((error) => {
          console.error("All Profiles API Error:", error);
          return null;
        });

      const user =
        profileResult?.data?.user ||
        profileResult?.data?.profile ||
        null;

      if (user) {
        setUserName(user.fullName || "User");

        const fields = [
          Boolean(user.dateOfBirth),
          Boolean(user.height),
          Boolean(user.education && user.profession),
          Boolean(user.city && user.state),
          Boolean(user.aboutMe?.trim()),
          Boolean(user.profileImage),
        ];

        const completedFields = fields.filter(Boolean).length;

        setCompletion(
          Math.round((completedFields / fields.length) * 100)
        );
      }

      const profiles =
        matchesResult?.data?.profiles ||
        matchesResult?.data?.users ||
        [];

      if (!Array.isArray(profiles)) {
        setMatches([]);
        return;
      }

      /*
        Backend already calculates:
        60% - 100% => isRecommended: true
        0% - 59%   => isRecommended: false

        Dashboard par sirf recommended profiles dikhayenge.
      */
      const recommendations = profiles
        .filter((profile) => profile.isRecommended === true)
        .sort(
          (a, b) =>
            (b.matchScore || 0) - (a.matchScore || 0)
        )
        .slice(0, 4);

      setMatches(recommendations);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Dashboard data load nahi ho paya");
    } finally {
      setProfileLoading(false);
      setMatchesLoading(false);
    }
  };

  const features = [
    {
      title: "My Profile",
      description: "Apni personal information update karein",
      icon: User,
      path: "/profile",
      color: "rose",
    },
    {
      title: "Browse Profiles",
      description: "Apne liye suitable profiles dekhein",
      icon: Search,
      path: "/browse",
      color: "pink",
    },
    {
      title: "Received Interests",
      description: "Aapko bheje gaye interests dekhein",
      icon: Heart,
      path: "/interests",
      color: "purple",
    },
    {
      title: "My Matches",
      description: "Aapke accepted matches",
      icon: Users,
      path: "/matches",
      color: "orange",
    },
    {
      title: "Messages",
      description: "Apne matches se baat karein",
      icon: MessageCircle,
      path: "/matches",
      color: "blue",
    },
    {
      title: "Partner Preferences",
      description: "Apni partner preferences manage karein",
      icon: Settings,
      path: "/partner-preferences",
      color: "indigo",
    },
  ];

  const colorClasses = {
    rose: "bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
    purple:
      "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    orange:
      "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    indigo:
      "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Shared Navbar */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <p className="text-sm font-medium text-rose-600">
                Welcome Back 👋
              </p>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Hello, {userName.split(" ")[0]}!
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Aapki perfect life partner ki journey yahin se shuru hoti hai.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={profileLoading || matchesLoading}
            className="flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                profileLoading || matchesLoading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh Dashboard
          </button>
        </div>

        {/* Hero Section */}
        <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 p-6 text-white shadow-xl sm:p-10">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium">
                <Sparkles size={16} />
                Your Journey to Forever
              </div>

              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                Har Rishta Khaas Hai,
                <br />
                Apna Rishta Sabse Khaas!
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                Apni profile complete karein aur apne liye compatible life
                partner explore karein.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-rose-600 shadow-lg hover:bg-rose-50"
                >
                  Complete Profile
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate("/browse")}
                  className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20"
                >
                  Explore Profiles
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="rounded-2xl border border-white/20 bg-white/15 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80">
                    Profile Completion
                  </p>

                  <h3 className="mt-1 text-4xl font-extrabold">
                    {profileLoading ? "..." : `${completion}%`}
                  </h3>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <UserRound size={30} />
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-white/80">
                {completion === 100
                  ? "Great! Aapki profile complete hai."
                  : "Profile complete karne se dusre members ko aapko samajhne mein madad milegi."}
              </p>

              <button
                onClick={() => navigate("/profile")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 py-3 text-sm font-bold hover:bg-white/30"
              >
                Update My Profile
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Smart Matches */}
        <section className="mb-10">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-rose-600">
                <Sparkles size={20} />

                <span className="text-sm font-bold uppercase tracking-wider">
                  Smart Recommendations
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Suggested Matches
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Aapki saved partner preferences ke basis par suggestions.
              </p>
            </div>

            <button
              onClick={() => navigate("/browse")}
              className="flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-700"
            >
              View All Profiles
              <ArrowRight size={16} />
            </button>
          </div>

          {matchesLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <Heart size={30} />
              </div>

              <h3 className="text-lg font-bold text-gray-800">
                No strong preference matches found yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Abhi aapki preferences ke according 60% ya usse zyada match
                wala profile available nahi hai. Partner preferences update
                karke aur profiles explore karein.
              </p>

              <button
                onClick={() => navigate("/browse")}
                className="mt-5 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-700"
              >
                Browse Profiles
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {matches.map((profile) => (
                <div
                  key={profile._id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-rose-50">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.fullName || "Profile"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-rose-300">
                        <UserRound size={75} />
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-600 shadow">
                      <Sparkles size={13} />
                      {profile.matchScore}% Match
                    </div>

                    <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                      {profile.age
                        ? `${profile.age} years`
                        : "Age not available"}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="truncate text-lg font-bold text-gray-900">
                      {profile.fullName || "Name not available"}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm text-gray-500">
                      {profile.city && (
                        <p className="flex items-center gap-2">
                          <MapPin
                            size={15}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {profile.city}
                            {profile.state ? `, ${profile.state}` : ""}
                          </span>
                        </p>
                      )}

                      {profile.education && (
                        <p className="flex items-center gap-2">
                          <GraduationCap
                            size={15}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {profile.education}
                          </span>
                        </p>
                      )}

                      {profile.profession && (
                        <p className="flex items-center gap-2">
                          <BriefcaseBusiness
                            size={15}
                            className="shrink-0 text-rose-500"
                          />
                          <span className="truncate">
                            {profile.profession}
                          </span>
                        </p>
                      )}

                      {profile.maritalStatus && (
                        <p className="flex items-center gap-2">
                          <CheckCircle
                            size={15}
                            className="shrink-0 text-rose-500"
                          />
                          <span>{profile.maritalStatus}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/profiles/${profile._id}`)
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-sm font-bold text-rose-600 hover:bg-rose-600 hover:text-white"
                    >
                      View Profile
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Quick Access
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Apne account ke important sections yahan se open karein.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <button
                  key={feature.title}
                  onClick={() => navigate(feature.path)}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition duration-300 ${colorClasses[feature.color]}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-800">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {feature.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={18}
                    className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-rose-600"
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Privacy */}
        <section className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <ShieldCheck size={30} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                Your Privacy Matters
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Apni profile information aur contact details ko thoughtfully
                manage karein. Contact sharing app ke existing permissions
                ke according hoti hai.
              </p>
            </div>
          </div>
        </section>

        {/* Profile CTA */}
        <section className="mb-8 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Mail size={27} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Build Your Perfect Profile
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Apni details update karke profile ko informative banayein.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-3 font-bold text-white shadow-md hover:shadow-lg"
            >
              Edit Profile
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-rose-100 py-6 text-center">
          <p className="text-sm text-gray-500">
            Made with{" "}
            <Heart
              size={14}
              className="mx-1 inline text-rose-500"
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

export default Dashboard;