import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import {
  Heart,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Search,
  ArrowLeft,
  UserRound,
  SlidersHorizontal,
  X,
  Sparkles,
  RefreshCw,
  Crown,
  Award,
  Star,
} from "lucide-react";

const API = "https://ahirwarsadi-api.onrender.com";

const Browse = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sendingInterest, setSendingInterest] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [interestStats, setInterestStats] = useState(null);

  const initialFilters = {
    minAge: "18",
    maxAge: "60",
    city: "",
    state: "",
    education: "",
    profession: "",
    maritalStatus: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  // ===================================
  // FETCH PROFILES
  // ===================================

  const fetchProfiles = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/api/profile/all`, {
        withCredentials: true,
      });

      setProfiles(
        response.data.profiles ||
          response.data.users ||
          []
      );
    } catch (error) {
      console.error("Browse Profiles Error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Unable to load profiles"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // FETCH INTEREST STATS
  // ===================================

  const fetchInterestStats = async () => {
    try {
      const response = await axios.get(
        `${API}/api/interest/stats`,
        {
          withCredentials: true,
        }
      );

      setInterestStats(
        response.data.stats || null
      );
    } catch (error) {
      console.error(
        "Interest Stats Error:",
        error
      );

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // ===================================
  // INITIAL LOAD
  // ===================================

  useEffect(() => {
    fetchProfiles();
    fetchInterestStats();
  }, []);

  // ===================================
  // SEND INTEREST
  // ===================================

  const handleSendInterest = async (receiverId) => {
    try {
      setSendingInterest(receiverId);

      const response = await axios.post(
        `${API}/api/interest/send`,
        {
          receiverId,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        response.data.message ||
          "Interest sent successfully"
      );

      await fetchInterestStats();
    } catch (error) {
      console.error(
        "Send Interest Error:",
        error
      );

      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      if (
        error.response?.status === 403 &&
        error.response?.data?.limitReached
      ) {
        toast.error(
          error.response.data.message ||
            "Monthly interest limit reached"
        );

        await fetchInterestStats();

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Interest send nahi hua"
      );
    } finally {
      setSendingInterest(null);
    }
  };

  // ===================================
  // FILTER CHANGE
  // ===================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================
  // CLEAR FILTERS
  // ===================================

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearch("");
  };

  // ===================================
  // SAFE TEXT MATCHING
  // ===================================

  const includesText = (value, searchValue) => {
    return String(value || "")
      .toLowerCase()
      .includes(
        searchValue.toLowerCase().trim()
      );
  };

  // ===================================
  // FILTER PROFILES
  // ===================================

  const filteredProfiles = profiles.filter(
    (profile) => {
      const searchText =
        search.toLowerCase().trim();

      const searchableText = [
        profile.fullName,
        profile.city,
        profile.state,
        profile.education,
        profile.profession,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText ||
        searchableText.includes(
          searchText
        );

      const age =
        profile.age === null ||
        profile.age === undefined
          ? null
          : Number(profile.age);

      const matchesAge =
        age === null ||
        (age >= Number(filters.minAge) &&
          age <= Number(filters.maxAge));

      const matchesCity =
        !filters.city ||
        includesText(
          profile.city,
          filters.city
        );

      const matchesState =
        !filters.state ||
        includesText(
          profile.state,
          filters.state
        );

      const matchesEducation =
        !filters.education ||
        includesText(
          profile.education,
          filters.education
        );

      const matchesProfession =
        !filters.profession ||
        includesText(
          profile.profession,
          filters.profession
        );

      const matchesMaritalStatus =
        !filters.maritalStatus ||
        profile.maritalStatus ===
          filters.maritalStatus;

      return (
        matchesSearch &&
        matchesAge &&
        matchesCity &&
        matchesState &&
        matchesEducation &&
        matchesProfession &&
        matchesMaritalStatus
      );
    }
  );

  // ===================================
  // SPLIT RECOMMENDED / OTHER
  // ===================================

  const recommendedProfiles =
    filteredProfiles.filter(
      (profile) =>
        profile.isRecommended === true
    );

  const otherProfiles =
    filteredProfiles.filter(
      (profile) =>
        profile.isRecommended !== true
    );

  // ===================================
  // PROFILE CARD
  // ===================================

  const renderProfileCard = (profile) => {
    const isGold =
      profile.membershipActive &&
      profile.membershipBadge === "Gold";

    const isSilver =
      profile.membershipActive &&
      profile.membershipBadge === "Silver";

    return (
      <div
        key={profile._id}
        className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
          isGold
            ? "border-amber-300 ring-1 ring-amber-100"
            : isSilver
              ? "border-slate-300 ring-1 ring-slate-100"
              : "border-rose-100"
        }`}
      >
        {/* IMAGE */}

        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-rose-100 to-pink-200">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={
                profile.fullName ||
                "Profile"
              }
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-rose-300">
              <UserRound size={90} />
            </div>
          )}

          {/* Bottom Gradient */}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16">
            <h3 className="truncate text-xl font-bold text-white">
              {profile.fullName ||
                "Name not available"}
            </h3>

            <p className="mt-1 text-sm font-medium text-white/90">
              {profile.age !== null &&
              profile.age !== undefined
                ? `${profile.age} years`
                : "Age not provided"}

              {profile.height
                ? ` • ${profile.height}`
                : ""}
            </p>
          </div>

          {/* MATCH SCORE */}

          {profile.matchScore > 0 && (
            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-extrabold text-rose-600 shadow-md backdrop-blur-sm">
              <Star
                size={14}
                fill="currentColor"
              />

              {profile.matchScore}% Match
            </div>
          )}

          {/* Marital Status */}

          {profile.maritalStatus && (
            <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-rose-600 shadow">
              {profile.maritalStatus}
            </div>
          )}

          {/* Gold Badge */}

          {isGold && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-amber-600 shadow-md backdrop-blur-sm">
              <Crown
                size={14}
                fill="currentColor"
              />

              Gold Member
            </div>
          )}

          {/* Silver Badge */}

          {isSilver && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-md backdrop-blur-sm">
              <Award size={14} />

              Silver Member
            </div>
          )}
        </div>

        {/* DETAILS */}

        <div className="p-5">
          {/* Recommendation */}

          {profile.isRecommended === true && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <Sparkles size={15} />

                Recommended for You
              </div>

              {profile.matchScore > 0 && (
                <span className="text-xs font-extrabold text-rose-600">
                  {profile.matchScore}%
                </span>
              )}
            </div>
          )}

          <div className="space-y-3 text-sm text-gray-600">
            {profile.education && (
              <div className="flex items-center gap-3">
                <GraduationCap
                  size={19}
                  className="shrink-0 text-rose-500"
                />

                <span className="truncate">
                  {profile.education}
                </span>
              </div>
            )}

            {profile.profession && (
              <div className="flex items-center gap-3">
                <BriefcaseBusiness
                  size={18}
                  className="shrink-0 text-rose-500"
                />

                <span className="truncate">
                  {profile.profession}
                </span>
              </div>
            )}

            {(profile.city ||
              profile.state) && (
              <div className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="shrink-0 text-rose-500"
                />

                <span className="truncate">
                  {[
                    profile.city,
                    profile.state,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            {profile.gender && (
              <div className="flex items-center gap-3">
                <UserRound
                  size={18}
                  className="shrink-0 text-rose-500"
                />

                <span>
                  {profile.gender}
                </span>
              </div>
            )}
          </div>

          {/* About */}

          {profile.aboutMe && (
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
              {profile.aboutMe}
            </p>
          )}

          {/* Gold Info */}

          {isGold && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              <Crown
                size={15}
                fill="currentColor"
              />

              Premium Gold Profile
            </div>
          )}

          {/* Silver Info */}

          {isSilver && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              <Award size={15} />

              Premium Silver Profile
            </div>
          )}

          {/* BUTTONS */}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                navigate(
                  `/profiles/${profile._id}`
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
            >
              View Profile
            </button>

            <button
              onClick={() =>
                handleSendInterest(
                  profile._id
                )
              }
              disabled={
                sendingInterest ===
                profile._id
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-sm font-bold text-white shadow-sm transition hover:from-rose-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Heart size={17} />

              {sendingInterest ===
              profile._id
                ? "Sending..."
                : "Interest"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-40 border-b border-rose-100 bg-white/90 shadow-sm backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate("/")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
              <Heart
                size={23}
                fill="currentColor"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Ahirwar
                <span className="text-rose-600">
                  Sadi
                </span>
              </h1>

              <p className="text-[10px] font-medium tracking-widest text-gray-500">
                FIND YOUR PERFECT MATCH
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-rose-600"
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

        {/* HEADING */}

        <div className="mb-9 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-600">
            <Sparkles size={16} />

            Discover Connections
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Discover Your Perfect Match ❤️
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore profiles selected
            according to your partner
            preferences.
          </p>
        </div>

        {/* SEARCH */}

        <div className="mx-auto mb-5 max-w-3xl">
          <div className="flex items-center rounded-2xl border border-gray-100 bg-white px-4 shadow-sm transition focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100">
            <Search
              className="shrink-0 text-gray-400"
              size={22}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, city, education or profession..."
              className="w-full bg-transparent p-4 text-sm outline-none"
            />

            {search && (
              <button
                onClick={() =>
                  setSearch("")
                }
                className="text-gray-400 hover:text-rose-600"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* FILTER CONTROLS */}

        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between">
          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
          >
            <SlidersHorizontal size={18} />

            {showFilters
              ? "Hide Filters"
              : "Advanced Filters"}
          </button>

          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition hover:text-rose-600"
          >
            <X size={16} />

            Clear All
          </button>
        </div>

        {/* ADVANCED FILTERS */}

        {showFilters && (
          <div className="mx-auto mb-10 max-w-5xl rounded-3xl border border-rose-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <SlidersHorizontal size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Find Your Ideal Partner
                </h3>

                <p className="text-xs text-gray-500">
                  Customize your search
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Minimum Age */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Minimum Age
                </label>

                <select
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  className={inputClass}
                >
                  {Array.from(
                    { length: 43 },
                    (_, i) => i + 18
                  ).map((age) => (
                    <option
                      key={age}
                      value={age}
                    >
                      {age} years
                    </option>
                  ))}
                </select>
              </div>

              {/* Maximum Age */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Maximum Age
                </label>

                <select
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  className={inputClass}
                >
                  {Array.from(
                    { length: 43 },
                    (_, i) => i + 18
                  ).map((age) => (
                    <option
                      key={age}
                      value={age}
                    >
                      {age} years
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  City
                </label>

                <input
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="Enter city"
                  className={inputClass}
                />
              </div>

              {/* State */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  State
                </label>

                <input
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="Enter state"
                  className={inputClass}
                />
              </div>

              {/* Education */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Education
                </label>

                <input
                  name="education"
                  value={filters.education}
                  onChange={handleFilterChange}
                  placeholder="e.g. B.Tech, MBA"
                  className={inputClass}
                />
              </div>

              {/* Profession */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profession
                </label>

                <input
                  name="profession"
                  value={filters.profession}
                  onChange={handleFilterChange}
                  placeholder="e.g. Software Engineer"
                  className={inputClass}
                />
              </div>

              {/* Marital Status */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Marital Status
                </label>

                <select
                  name="maritalStatus"
                  value={filters.maritalStatus}
                  onChange={handleFilterChange}
                  className={inputClass}
                >
                  <option value="">
                    Any Status
                  </option>

                  <option value="Never Married">
                    Never Married
                  </option>

                  <option value="Divorced">
                    Divorced
                  </option>

                  <option value="Widowed">
                    Widowed
                  </option>
                </select>
              </div>
            </div>

            <p className="mt-5 text-xs text-gray-400">
              Recommendations are
              automatically calculated from
              your saved partner preferences.
            </p>
          </div>
        )}

        {/* RESULTS HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">
              Matrimonial Profiles
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Profiles are ranked according
              to your preferences.
            </p>

            {interestStats && (
              <div className="mt-3">
                {interestStats.unlimited ? (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                    ♾️ Unlimited Interests
                  </div>
                ) : (
                  <div className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
                    <Heart
                      size={14}
                      fill="currentColor"
                    />

                    {interestStats.used} /{" "}
                    {
                      interestStats.monthlyLimit
                    }{" "}
                    Interests Used

                    <span className="font-medium text-gray-500">
                      (
                      {
                        interestStats.remaining
                      }{" "}
                      remaining)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="self-start rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-600 sm:self-auto">
            {filteredProfiles.length} Found
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  <div className="h-64 bg-rose-100" />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-2/3 rounded bg-gray-100" />

                    <div className="h-4 w-1/2 rounded bg-gray-100" />

                    <div className="h-4 w-3/4 rounded bg-gray-100" />

                    <div className="h-11 rounded-xl bg-gray-100" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : filteredProfiles.length === 0 ? (
          /* EMPTY STATE */

          <div className="rounded-3xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-400">
              <UserRound size={42} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              No Profiles Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Try changing your search
              or filters to discover more
              profiles.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* ===================================
                RECOMMENDED PROFILES
            =================================== */}

            {recommendedProfiles.length > 0 && (
              <section className="mb-12">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                        <Sparkles size={19} />
                      </div>

                      <h3 className="text-xl font-extrabold text-gray-900">
                        Recommended for You
                      </h3>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Profiles matching your
                      partner preferences.
                    </p>
                  </div>

                  <div className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-600">
                    {recommendedProfiles.length}{" "}
                    Matches
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedProfiles.map(
                    renderProfileCard
                  )}
                </div>
              </section>
            )}

            {/* ===================================
                MORE PROFILES
            =================================== */}

            {otherProfiles.length > 0 && (
              <section>
                <div className="mb-5">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    More Profiles
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Other verified profiles
                    you may like.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {otherProfiles.map(
                    renderProfileCard
                  )}
                </div>
              </section>
            )}

            {/* No recommended profiles */}

            {recommendedProfiles.length ===
              0 &&
              otherProfiles.length > 0 && (
                <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center text-sm text-amber-700">
                  <Sparkles
                    size={17}
                    className="mr-1 inline"
                  />

                  No strong preference
                  matches found yet. You can
                  update your partner
                  preferences to get better
                  recommendations.
                </div>
              )}
          </>
        )}

        {/* REFRESH */}

        {!loading && profiles.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => {
                fetchProfiles();
                fetchInterestStats();
              }}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
            >
              <RefreshCw size={16} />

              Refresh Profiles
            </button>
          </div>
        )}

        {/* FOOTER */}

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
            © {new Date().getFullYear()}{" "}
            AhirwarSadi. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Browse;