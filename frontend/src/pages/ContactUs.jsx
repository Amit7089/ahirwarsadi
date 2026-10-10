
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function ContactUs() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "How can I contact the support team?",
      answer:
        "You can contact us through our official email address or phone number mentioned on this page.",
    },
    {
      question: "Can I get help with my profile?",
      answer:
        "Yes! Contact our support team for assistance with profile details, account access, membership, and other website-related questions.",
    },
    {
      question: "How can I ask about membership?",
      answer:
        "Reach out to us by email or phone for questions about membership plans and payment-related concerns.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf7] text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-rose-700 px-4 py-20 text-center text-white sm:py-24">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-rose-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur">
            <MessageCircle size={32} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-rose-200">
            We Are Here For You
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Contact <span className="text-rose-200">Us</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-rose-100 sm:text-lg">
            Every meaningful connection starts with trust. Have a question
            or need assistance? Our team is happy to help you on your
            AhirwarSadi.com journey.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-rose-100">
            <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <Heart size={15} /> Made for meaningful connections
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2">
              <ShieldCheck size={15} /> Support you can reach
            </span>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
            Get In Touch
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            We Would Love to Hear From You
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Whether you need help with your account, profile, or membership,
            use the contact details below to reach us.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Email Card */}
          <div className="group rounded-3xl border border-rose-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-800 transition group-hover:bg-rose-800 group-hover:text-white">
              <Mail size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Email Support
            </h3>

            <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
              Send us an email for questions or assistance.
            </p>

            <a
              href="mailto:ahirwarsadi7@gmail.com"
              className="mt-4 block break-all font-semibold text-rose-800 hover:text-rose-950"
            >
              ahirwarsadi7@gmail.com
            </a>

            <a
              href="mailto:ahirwarsadi7@gmail.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 transition hover:bg-rose-100"
            >
              Email Us <ArrowRight size={16} />
            </a>
          </div>

          {/* Phone Card */}
          <div className="group rounded-3xl border border-rose-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-800 transition group-hover:bg-rose-800 group-hover:text-white">
              <Phone size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Phone Support
            </h3>

            <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
              Prefer speaking directly? Give us a call.
            </p>

            <a
              href="tel:+917089030657"
              className="mt-4 block font-semibold text-rose-800 hover:text-rose-950"
            >
              +91 7089030657
            </a>

            <a
              href="tel:+917089030657"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 transition hover:bg-rose-100"
            >
              Call Us <ArrowRight size={16} />
            </a>
          </div>

          {/* Location Card */}
          <div className="group rounded-3xl border border-rose-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-100/60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-800 transition group-hover:bg-rose-800 group-hover:text-white">
              <MapPin size={27} />
            </div>

            <h3 className="mt-6 text-xl font-bold text-gray-900">
              Our Location
            </h3>

            <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500">
              Our official business location.
            </p>

            <p className="mt-4 font-semibold leading-7 text-gray-800">
              Village Ghoora,
              <br />
              District Chhatarpur,
              <br />
              Madhya Pradesh, India
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Village+Ghoora+District+Chhatarpur+Madhya+Pradesh+India"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800 transition hover:bg-rose-100"
            >
              View Location <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Support Promise */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 to-rose-800 px-6 py-10 text-white sm:px-12 sm:py-12">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">
                Your Journey Matters
              </p>

              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Need a Little Help?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-rose-100">
                We understand that finding the right connection is important.
                If you have any questions about AhirwarSadi.com, please get
                in touch with our support team.
              </p>
            </div>

            <a
              href="mailto:ahirwarsadi7@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-rose-900 shadow-lg transition hover:bg-rose-50"
            >
              <Mail size={18} />
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
            Quick Help
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(openFaq === index ? -1 : index)
                }
                aria-expanded={openFaq === index}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-gray-900 sm:p-6"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-rose-700 transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openFaq === index && (
                <div className="px-5 pb-5 text-sm leading-7 text-gray-600 sm:px-6 sm:pb-6">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#24151b] px-4 py-8 text-center text-sm text-gray-400">
        <div className="mb-3 flex items-center justify-center gap-2 text-white">
          <Heart size={17} className="fill-rose-500 text-rose-500" />
          <span className="font-bold">AhirwarSadi.com</span>
        </div>

        <p>Bringing hearts and families closer together.</p>

        <p className="mt-3">
          © {new Date().getFullYear()} AhirwarSadi.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
