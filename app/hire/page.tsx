"use client";

import { useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzi_lBi9iz_5rd2XM2FZnKIasIsoGoJmJT_6_LYGfyU7fkGalqiKkFlEvkSjQGXFCHldw/exec";

export default function HirePage() {
  const [form, setForm] = useState({
    company: "",
    email: "",
    interest: "AI Engineer",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

 const handleSubmit = async () => {
  if (!form.company || !form.email) {
    setError("Please fill in all required fields.");
    return;
  }

  setLoading(true);
  setError("");

  const params = new URLSearchParams({
    source: "hire",
    company: form.company,
    email: form.email,
    interest: form.interest,
  });

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);

    if (!res.ok) throw new Error("Request failed");

    setSubmitted(true);
    setForm({ company: "", email: "", interest: "AI Engineer" });

  } catch (err) {
    console.error(err);
    setError("Submission failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-4 md:px-6 py-16">
      <div className="bg-white rounded-3xl p-6 md:p-10 max-w-5xl w-full shadow-sm grid md:grid-cols-2 gap-4 md:gap-10">

        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-tight">
            Hire Industry-Ready{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              AI Talent
            </span>
          </h2>

          <p className="text-gray-500 mt-3 text-sm md:text-base leading-relaxed">
            Access a pre-vetted pool of AI engineers trained on real-world projects.
          </p>

          <div className="mt-5 flex gap-3 flex-wrap">
            <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full text-sm">
              Book Call
            </button>
            <button className="border px-5 py-2 rounded-full text-sm">
              View Skills
            </button>
          </div>
        </div>

        {/* RIGHT FORM */}
        {submitted ? (
          <div className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-center">
            <p className="text-xl font-semibold">🎉 Request received!</p>
            <p className="text-sm mt-2">Our team will reach out to you shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm underline text-green-600 hover:text-green-800 transition"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Company Name *"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Work Email *"
            />

            <div>
              <label htmlFor="hiring-interest" className="text-xs text-gray-500">
                Hiring Interest
              </label>
              <select
                id="hiring-interest"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>AI Engineer</option>
                <option>Full Stack Developer</option>
                <option>Data Scientist</option>
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

          </div>
        )}

      </div>
    </section>
  );
}