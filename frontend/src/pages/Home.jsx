import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ArrowRight,
  Heart,
  Users,
  ShieldCheck,
  UserPlus,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  Sparkles,
  LockKeyhole,
  HeartHandshake,
  Search,
  Crown,
  Star,
  UserRound,
  BadgeCheck,
  Gem,
  Handshake,
  CalendarHeart,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Register and share your personal details, education, profession and partner preferences.",
    },
    {
      number: "02",
      icon: Search,
      title: "Explore Profiles",
      description:
        "Discover available profiles and learn more about people who interest you.",
    },
    {
      number: "03",
      icon: Heart,
      title: "Express Your Interest",
      description:
        "Send an interest and wait for the other person to respond.",
    },
    {
      number: "04",
      icon: MessageCircle,
      title: "Connect & Communicate",
      description:
        "When an interest is accepted, use the available match and communication features.",
    },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Privacy Matters",
      description:
        "Profile and contact visibility are controlled according to the platform's access rules.",
    },
    {
      icon: HeartHandshake,
      title: "Meaningful Connections",
      description:
        "Discover people with compatible preferences and relationship goals.",
    },
    {
      icon: BadgeCheck,
      title: "Profile-Based Discovery",
      description:
        "Review profile details and preferences before expressing interest.",
    },
    {
      icon: LockKeyhole,
      title: "Member-Focused Experience",
      description:
        "Manage your profile, interests and eligible member features in one place.",
    },
  ];

  const faqs = [
    {
      question: "How do I register on AhirwarSadi.com?",
      answer:
        "Click Create Free Profile, register your account and complete your profile details.",
    },
    {
      question: "Can I browse profiles after registering?",
      answer:
        "You can use Browse Profiles to explore profiles available to your account. Profile visibility depends on the platform's rules.",
    },
    {
      question: "How do interests and matches work?",
      answer:
        "You can send an interest to another member. If the interest is accepted, the platform can create a match.",
    },
    {
      question: "How can I communicate with a match?",
      answer:
        "Use the communication features available to your account. Contact-detail access may depend on match status and membership eligibility.",
    },
    {
      question: "What membership plans are available?",
      answer:
        "Open the Membership page to see the plans, prices, durations and included features currently offered by the website.",
    },
    {
      question: "How can I get help?",
      answer:
        "Visit the Contact Us page from the footer to find support information.",
    },
  ];

  const handleSearch = () => {
    navigate("/browse", {
      state: {
        lookingFor,
        ageRange,
        location,
      },
    });
  };

  const membershipPlans = [
    {
      icon: Heart,
      name: "Free",
      description: "Get started with your matrimonial journey.",
      features: [
        "Create your profile",
        "Explore available profiles",
        "Basic member features",
      ],
      button: "Get Started",
      style: "border-gray-200 bg-white",
      iconStyle: "bg-gray-100 text-gray-700",
    },
    {
      icon: Crown,
      name: "Silver",
      description: "Enjoy additional membership features.",
      features: [
        "Silver membership features",
        "Eligible contact access",
        "Membership for 3 months",
      ],
      button: "Explore Silver",
      style: "border-rose-300 bg-rose-50/60 shadow-xl shadow-rose-100",
      iconStyle: "bg-rose-100 text-rose-800",
      popular: true,
    },
    {
      icon: Gem,
      name: "Gold",
      description: "Explore the extended membership experience.",
      features: [
        "Gold membership features",
        "Eligible contact access",
        "Membership for 6 months",
      ],
      button: "Explore Gold",
      style: "border-amber-200 bg-white",
      iconStyle: "bg-amber-100 text-amber-800",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf7] text-gray-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#fff8f5] via-[#fffaf7] to-rose-100/70">
        <div className="absolute -left-24 -top-20 -z-10 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute -bottom-20 right-0 -z-10 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/90 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm">
              <Sparkles size={16} />
              Your journey to a meaningful relationship
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.13] tracking-tight sm:text-5xl lg:text-[3.8rem]">
              Find Someone
              <span className="block text-rose-800">Who Feels Like</span>
              <span className="block">Home.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Every relationship begins with a connection. Discover
              compatible profiles, express your interest and take the
              next step toward your future together.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-800 px-7 py-4 font-bold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-900"
              >
                Create Free Profile
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/browse")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300 bg-white px-7 py-4 font-bold text-rose-900 transition hover:bg-rose-50"
              >
                <Search size={18} />
                Browse Profiles
              </button>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <CheckCircle size={17} className="text-rose-700" />
                Preference-based discovery
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={17} className="text-rose-700" />
                Privacy-focused features
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-5">
            <div className="absolute -right-4 -top-5 h-28 w-28 rounded-full border-[18px] border-rose-200/50 sm:-right-6 sm:h-36 sm:w-36" />

            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=85"
              alt="Wedding celebration"
              fetchPriority="high"
              className="relative h-[330px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[440px] lg:h-[500px]"
            />

            <div className="absolute -bottom-1 left-3 right-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-xl sm:left-7 sm:right-7 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100">
                  <Heart className="text-rose-800" size={25} />
                </div>
                <div>
                  <h2 className="font-bold sm:text-lg">
                    Your Story Starts Here
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">
                    Discover possibilities, one connection at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH PANEL */}
      <section className="relative z-10 mx-auto -mt-1 max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-xl shadow-rose-100/50 sm:p-8">
          <div className="mb-7 text-center">
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              START YOUR SEARCH
            </span>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Find a Compatible Partner
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
              Choose your preferences to get started.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="lookingFor"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Looking For
              </label>
              <select
                id="lookingFor"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3.5 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Select</option>
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="ageRange"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Age Range
              </label>
              <select
                id="ageRange"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3.5 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Any age</option>
                <option value="18-25">18–25</option>
                <option value="26-30">26–30</option>
                <option value="31-35">31–35</option>
                <option value="36-40">36–40</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Preferred Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3.5 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Any location</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={handleSearch}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-rose-800 px-5 py-3.5 font-bold text-white transition hover:bg-rose-900"
              >
                <Search size={19} />
                Search Profiles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=1000&auto=format&fit=crop&q=85"
              alt="Wedding celebration and togetherness"
              loading="lazy"
              className="h-[310px] w-full rounded-3xl object-cover shadow-lg sm:h-[420px]"
            />
            <div className="absolute -bottom-4 right-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg sm:right-8 sm:p-5">
              <div className="flex items-center gap-3">
                <HeartHandshake className="text-rose-800" size={32} />
                <div>
                  <p className="font-bold">Built Around Connection</p>
                  <p className="mt-1 text-xs text-gray-500">
                    A thoughtful matrimonial experience
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:pl-5 lg:pt-0">
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              WELCOME TO AHIRWARSADI
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              More Than a Profile,
              <span className="block text-rose-800">
                A New Beginning.
              </span>
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Finding a life partner is an important step. AhirwarSadi.com
              brings profile discovery, interests, matching and member
              communication features together in one place.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Create your profile, share what matters to you and explore
              potential connections at your own pace.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Create and manage your matrimonial profile",
                "Explore profiles and partner preferences",
                "Send interests and manage responses",
                "Use available matching and communication features",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-rose-700"
                  />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/about")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-800 px-7 py-3.5 font-bold text-white transition hover:bg-rose-900"
            >
              Discover Our Story
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              THE EXPERIENCE
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              A Thoughtful Way to Connect
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600">
              Explore tools designed to help you manage your matrimonial
              journey with greater convenience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-rose-100 bg-[#fffaf7] p-7 transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 transition group-hover:bg-rose-800">
                  <Icon
                    size={27}
                    className="text-rose-800 transition group-hover:text-white"
                  />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              GETTING STARTED
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Four Steps to Get Started
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-600">
              Begin with a profile, explore your options and connect when
              there is mutual interest.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="relative rounded-2xl border border-rose-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="absolute right-5 top-4 text-sm font-extrabold text-rose-200">
                  {number}
                </span>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
                  <Icon className="text-rose-800" size={31} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECTION VALUES */}
      <section className="bg-[#fff0f1] py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              YOUR JOURNEY, YOUR CHOICE
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Take Your Time.
              <span className="block text-rose-800">
                Make a Meaningful Choice.
              </span>
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              A good connection starts with getting to know someone.
              Review available profile information, share interests
              respectfully and take the time you need.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <UserRound className="text-rose-800" size={27} />
                <h3 className="mt-3 font-bold">Your Profile</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Keep your profile details and preferences up to date.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <Handshake className="text-rose-800" size={27} />
                <h3 className="mt-3 font-bold">Mutual Interest</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Build connections through mutual interest and respect.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=85"
              alt="Wedding day celebration"
              loading="lazy"
              className="h-[320px] w-full object-cover sm:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* MEMBERSHIP PREVIEW */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
                MEMBERSHIP
              </span>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Choose Your Experience
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-gray-600">
                Explore the available plans and review their features
                before choosing a membership.
              </p>
            </div>

            <button
              onClick={() => navigate("/membership")}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-rose-300 bg-white px-5 py-3 font-bold text-rose-800 transition hover:bg-rose-50 sm:self-auto"
            >
              View All Plans
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {membershipPlans.map(
              ({
                icon: Icon,
                name,
                description,
                features: planFeatures,
                button,
                style,
                iconStyle,
                popular,
              }) => (
                <div
                  key={name}
                  className={`relative flex flex-col rounded-3xl border p-7 ${style}`}
                >
                  {popular && (
                    <span className="absolute right-5 top-5 rounded-full bg-rose-800 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white">
                      POPULAR
                    </span>
                  )}

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconStyle}`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-5 text-2xl font-extrabold">{name}</h3>
                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-600">
                    {description}
                  </p>

                  <div className="my-6 border-t border-gray-200" />

                  <div className="flex-1 space-y-4">
                    {planFeatures.map((item) => (
                      <div key={item} className="flex gap-3 text-sm">
                        <CheckCircle
                          size={18}
                          className="shrink-0 text-rose-700"
                        />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate("/membership")}
                    className={`mt-8 w-full rounded-xl px-5 py-3.5 font-bold transition ${
                      popular
                        ? "bg-rose-800 text-white hover:bg-rose-900"
                        : "border border-rose-200 bg-white text-rose-800 hover:bg-rose-50"
                    }`}
                  >
                    {button}
                  </button>
                </div>
              )
            )}
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-gray-500">
            Please review the current Membership page for actual prices,
            duration, eligibility and plan conditions.
          </p>
        </div>
      </section>

      {/* PERSONAL JOURNEY CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-rose-950 via-rose-900 to-rose-700 px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-rose-500/20 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                <CalendarHeart size={19} />
                YOUR NEXT CHAPTER STARTS HERE
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                A Beautiful Future Begins With One Step.
              </h2>
              <p className="mt-4 leading-7 text-rose-100">
                Create your profile and explore the possibilities waiting
                for you.
              </p>
            </div>

            <button
              onClick={() => navigate("/register")}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Start Your Journey
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <span className="text-xs font-extrabold tracking-[0.2em] text-rose-700">
              HELP & SUPPORT
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Find answers to common questions about using the platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map(({ question, answer }, index) => (
              <div
                key={question}
                className="overflow-hidden rounded-2xl border border-rose-100 bg-white"
              >
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq(openFaq === index ? -1 : index)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold transition hover:bg-rose-50 sm:p-6"
                >
                  <span>{question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-rose-700 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-5 pb-5 leading-7 text-gray-600 sm:px-6">
                    {answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 font-bold text-rose-800 hover:text-rose-950"
            >
              Still have questions? Contact Us
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#24151b] pt-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="text-left text-2xl font-extrabold"
                aria-label="Back to top"
              >
                Ahirwar
                <span className="text-rose-400">Sadi</span>
                <span className="text-rose-300">.com</span>
              </button>

              <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
                A matrimonial platform to discover compatible profiles
                and begin meaningful connections.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-rose-300">
                <Heart size={16} fill="currentColor" />
                Your journey matters.
              </div>
            </div>

            <div>
              <h3 className="mb-5 font-bold">Quick Links</h3>
              <div className="flex flex-col items-start gap-3 text-sm text-gray-400">
                {[
                  ["Home", "/"],
                  ["Browse Profiles", "/browse"],
                  ["Create Profile", "/register"],
                  ["Login", "/login"],
                  ["Membership", "/membership"],
                ].map(([label, path]) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="transition hover:translate-x-1 hover:text-rose-300"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-5 font-bold">About & Information</h3>
              <div className="flex flex-col items-start gap-3 text-sm text-gray-400">
                <button
                  onClick={() => navigate("/about")}
                  className="transition hover:translate-x-1 hover:text-rose-300"
                >
                  About Us
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="transition hover:translate-x-1 hover:text-rose-300"
                >
                  Contact Us
                </button>
              </div>

              <p className="mt-5 text-sm leading-6 text-gray-500">
                Learn about our platform or reach out if you need help.
              </p>
            </div>

            <div>
              <h3 className="mb-5 font-bold">Our Promise</h3>
              <p className="text-sm leading-7 text-gray-400">
                We aim to provide a convenient and respectful experience
                for people exploring matrimonial connections.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-rose-300">
                <ShieldCheck size={17} />
                Privacy-conscious experience
              </div>

              <button
                onClick={() => navigate("/contact")}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-400/40 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-white/10"
              >
                Contact Support
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 py-6 text-center text-sm text-gray-500 sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} AhirwarSadi.com. All rights reserved.
            </p>
            <p>Made for meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
