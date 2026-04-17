"use client";

import { useState } from "react";
type ContactDetail = {
  label: string;
  value: string | string[];
  href?: string | string[];
};
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwlfjo4hCGthhniNRewa72kJplgncmnmzl6YNb83R9nqrLmvAXuoHdyC0RV3hhCOrQq/exec";
const contactDetails: ContactDetail[] = [
  {
    label: "Merchant Legal Entity",
    value: "LLM AXIS PRIVATE LIMITED",
  },
  {
    label: "Registered Address",
    value:
      "Innov8 Mantri Commercio, Tower A, 5th Floor, Deeta, Bellandur, Bangalore, Bangalore South, Karnataka, India, 560103",
  },
  {
    label: "Operational Address",
    value:
      "Innov8 Mantri Commercio, Tower A, 5th Floor, Deeta, Bellandur, Bangalore, Bangalore South, Karnataka, India, 560103",
  },
  {
    label: "Telephone No",
    value: ["8309782214", "6300205469"],
    href: ["tel:8309782214", "tel:6300205469"],
  },
  {
    label: "E-Mail ID",
    value: "Contact@llmaxis.in",
    href: "mailto:Contact@llmaxis.in",
  },
];
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });

    try {
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4 md:px-6 py-16">
        <div className="bg-white rounded-3xl p-6 md:p-10 max-w-5xl w-full shadow-sm grid md:grid-cols-2 gap-6 md:gap-10">
          {/* LEFT */}
          {/* <div className="flex flex-col justify-center">
            ✅ Proper heading
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
              Hire Industry-Ready{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                AI Talent
              </span>
            </h1>

            ✅ Keyword enriched
            <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
              Connect with skilled AI engineers trained in real-world machine learning,
              automation, and full-stack AI development projects.
            </p>

            <div className="mt-5 flex gap-3 flex-wrap">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-black px-5 py-2 rounded-full text-sm">
                Book Call
              </button>
              <button className="border px-5 py-2 rounded-full text-sm">
                View Skills
              </button>
            </div>
          </div> */}

          {/* LEFT FORM */}
          {submitted ? (
            <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <p className="text-xl font-semibold">
                🎉 Submitted successfully!
              </p>
              <p className="text-sm mt-2">
                We&apos;ll get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm underline text-green-600 hover:text-green-800 transition"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ✅ Label added (hidden for design, useful for SEO + accessibility) */}
              <label className="sr-only">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Name *"
                required
              />

              <label className="sr-only">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Email *"
                required
              />

              <label className="sr-only">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Phone"
              />

              <label className="sr-only">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Message (optional)"
              />

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-black py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}

          {/* ── RIGHT: Contact Info ── */}
          <div className="bg-white rounded-2xl p-5 md:p-8 flex flex-col justify-center">
            {/* Header */}
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Contact Information
            </p>

            <p className="text-gray-500 text-xs mb-6">
              You may contact us using the information below:
            </p>

            {/* Contact List */}
            <div className="space-y-4">
              {contactDetails.map((item, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  {/* LABEL */}
                  <p className="text-xs font-medium text-gray-500 w-[101%]">
                    {item.label} :
                  </p>

                  {/* VALUE */}
                  <div className="w-[200%] text-left">
                    {Array.isArray(item.value) && Array.isArray(item.href) ? (
                      <p className="text-sm font-medium text-gray-800">
                        {item.value.map((val, idx) => (
                          <span key={idx}>
                            <a
                              href={(item.href as string[])[idx]}
                              className="hover:underline"
                            >
                              {val}
                            </a>
                            {idx !== (item.value as string[]).length - 1 &&
                              ", "}
                          </span>
                        ))}
                      </p>
                    ) : item.href ? (
                      <a
                        href={item.href as string}
                        className="text-sm font-medium text-gray-800 hover:underline"
                      >
                        {item.value as string}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-800 leading-snug">
                        {item.value as string}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
