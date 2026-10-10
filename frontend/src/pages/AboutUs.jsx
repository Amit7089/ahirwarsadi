import {
  Heart,
  ShieldCheck,
  Users,
  HeartHandshake,
  CheckCircle,
  Target,
  Sparkles,
  Quote,
  ArrowRight,
  UserRound,
  HandHeart,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function AboutUs() {
  const values = [
    {
      icon: HeartHandshake,
      title: "Meaningful Relationships",
      description:
        "We aim to help people discover compatible life partners and begin a new chapter with confidence.",
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Respect",
      description:
        "We believe every member deserves respect, privacy, and a comfortable experience while exploring profiles.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "We want to create a welcoming matrimonial space where individuals and families can explore connections.",
    },
  ];

  const commitments = [
    "Simple and convenient profile creation",
    "Discover profiles based on your preferences",
    "Express interest and explore potential matches",
    "Membership options for additional platform features",
    "A respectful experience for every member",
    "Support for account and platform-related questions",
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf7] text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-rose-700 px-4 py-20 text-white sm:py-28">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-rose-300/10 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-rose-100">
              <Heart size={16} className="fill-rose-300 text-rose-300" />A
              Journey Towards Togetherness
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              About
              <span className="mt-2 block text-rose-200">AhirwarSadi.com</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-rose-100 sm:text-lg">
              Every beautiful relationship begins with a connection. We created
              AhirwarSadi.com to make the journey of finding a life partner more
              convenient, comfortable, and meaningful.
            </p>

            <a
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-rose-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Start Your Journey <ArrowRight size={18} />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-white/10 rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
              alt="A couple celebrating their wedding"
              className="relative h-[300px] w-full rounded-[2rem] object-cover shadow-2xl sm:h-[420px]"
              loading="lazy"
            />
            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-rose-100 bg-white p-4 text-gray-800 shadow-xl sm:left-8 sm:right-8 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-100">
                  <Heart className="fill-rose-700 text-rose-700" size={22} />
                </div>
                <div>
                  <p className="font-bold">Made for meaningful connections</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your journey. Your preferences. Your future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85"
              alt="A wedding celebration with family and friends"
              className="h-[320px] w-full rounded-3xl object-cover shadow-lg sm:h-[430px]"
              loading="lazy"
            />
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-rose-100 sm:-right-5 sm:p-5">
              <p className="flex items-center gap-2 font-bold text-rose-900">
                <Sparkles size={19} />
                Built with a purpose
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Connecting people and possibilities
              </p>
            </div>
          </div>

          <div className="pt-4 md:pt-0">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rose-700">
              Who We Are
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              More Than a Matrimonial Website
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              AhirwarSadi.com is a matrimonial platform designed to help
              individuals discover potential life partners in a simple and
              organised way. Members can create their profiles, share their
              preferences, explore other profiles, and express interest in
              people they would like to know better.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              We understand that choosing a life partner is an important
              decision. Our aim is to provide useful tools that make profile
              discovery easier while encouraging respectful interactions and
              thoughtful decisions.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              We continue to improve the platform with the goal of making the
              matrimonial experience more accessible and convenient for our
              community.
            </p>
          </div>
        </div>
      </section>
      {/* Founder Section */}
             {/* Founder Section */}
      <section className="border-y border-rose-100 bg-white px-4 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">

          {/* Founder Image */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rotate-6 rounded-full bg-rose-200" />

              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-rose-200 sm:h-72 sm:w-72">
                <img
                  src="/Amit.jpg"
                  alt="Engineer Amit Ahirwar"
                  className="block h-full w-full object-cover object-center"
                />
              </div>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-rose-800 px-5 py-2 text-sm font-bold text-white shadow-lg">
                Founder & Developer
              </div>
            </div>

            <h3 className="mt-8 text-2xl font-extrabold text-gray-900">
              Engineer Amit Ahirwar
            </h3>

            <p className="mt-2 text-sm font-medium text-rose-700">
              Creator of AhirwarSadi.com
            </p>
          </div>

          {/* Founder Introduction */}
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rose-700">
              The Person Behind the Platform
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              A Vision Built with Purpose
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Hello, I am Engineer Amit Ahirwar, the founder and developer of
              AhirwarSadi.com. With an interest in technology and web
              development, I created this platform with the vision of making
              matrimonial profile discovery easier and more convenient for our
              community.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From designing the website to developing features for profiles,
              interests, matching, and memberships, my focus has been on
              creating a simple and user-friendly experience. I believe
              technology can help people explore meaningful connections in a
              more organised way.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              AhirwarSadi.com is a step towards bringing people closer by giving
              them a dedicated platform to discover profiles, express interest,
              and explore potential life partners at their own pace. The journey
              continues as I work to improve the platform and its features.
            </p>

            {/* Founder Quote */}
            <div className="mt-7 rounded-2xl border-l-4 border-rose-700 bg-rose-50 p-5 sm:p-6">
              <div className="text-3xl font-bold leading-none text-rose-700">
                “
              </div>

              <p className="mt-2 font-medium italic leading-7 text-rose-950">
                My vision is to use technology to make finding a compatible life
                partner a more comfortable, accessible, and meaningful
                experience.
              </p>

              <p className="mt-4 text-sm font-bold text-rose-800">
                — Engineer Amit Ahirwar
              </p>
            </div>

            {/* Skills / Focus */}
            <div className="mt-7 flex flex-wrap gap-3">
              {[
                "Technology",
                "Web Development",
                "Community",
                "Meaningful Connections",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rose-700">
            Our Direction
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Mission & Vision
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            The ideas that guide us as we build and improve our platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-rose-950 to-rose-800 p-8 text-white shadow-lg sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Target size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-bold">Our Mission</h3>
            <p className="mt-4 leading-8 text-rose-100">
              To provide a simple and accessible matrimonial platform where
              people can create profiles, explore compatible possibilities, and
              take the next step towards a meaningful relationship.
            </p>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-800">
              <Sparkles size={28} />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-900">
              Our Vision
            </h3>
            <p className="mt-4 leading-8 text-gray-600">
              To continue developing a trusted and user-friendly matrimonial
              experience that respects individual preferences and helps people
              connect with greater convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-rose-50/70 px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rose-700">
              What Matters to Us
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              The principles we aim to reflect in the experience we create.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl border border-rose-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-800">
                  <Icon size={27} />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-rose-700">
              What You Can Expect
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Commitment to Members
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              We aim to make your experience clear and convenient with practical
              tools for managing your profile and exploring potential matches.
            </p>

            <div className="mt-7 space-y-4">
              {commitments.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle
                    size={21}
                    className="mt-0.5 shrink-0 text-rose-700"
                  />
                  <p className="leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=85"
              alt="A joyful wedding celebration"
              className="h-[320px] w-full rounded-3xl object-cover shadow-xl sm:h-[430px]"
              loading="lazy"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur sm:inset-x-6 sm:bottom-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-800">
                  <HandHeart size={25} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Every connection deserves respect
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Explore profiles at your own pace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-700 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <Heart
            className="mx-auto mb-5 fill-rose-200 text-rose-200"
            size={36}
          />
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Your New Beginning Could Start Here
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-rose-100">
            Create your profile, share your preferences, and explore
            possibilities with AhirwarSadi.com.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-rose-900 transition hover:bg-rose-50"
            >
              Create Your Profile <ArrowRight size={18} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#24151b] px-4 py-8 text-center text-sm text-gray-400">
        <div className="mb-3 flex items-center justify-center gap-2 text-white">
          <Heart size={17} className="fill-rose-500 text-rose-500" />
          <span className="font-bold">AhirwarSadi.com</span>
        </div>
        <p>Bringing people closer to meaningful connections.</p>
        <p className="mt-3">
          © {new Date().getFullYear()} AhirwarSadi.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
