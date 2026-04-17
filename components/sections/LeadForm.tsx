"use client";

import { useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw0UjyDVuh39VtJsBdwRh1vTC6G2q10r5OmbeOVZ11_6tfBx5Ssw2wwr31wZ_3mmaL0KA/exec";

export default function LeadForm() {
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

  const handleSubmit = async () => {
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
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);

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
    <section className="py-24 bg-white">
  <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
    
    <h4 className="text-3xl md:text-4xl font-semibold">
      Get Free Career Consultation
    </h4>

    <h1 className="text-4xl md:text-6xl font-bold whitespace-nowrap">
      Start taking action today!
    </h1>

  </div>
</section>
  );
}
 {/* <p className="text-gray-500 mt-4">
          Talk to our experts and get a personalized roadmap.
        </p> */}

        {/* {submitted ? (
          <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <p className="text-xl font-semibold">🎉 Submitted successfully!</p>
            <p className="text-sm mt-2">We&apos;ll get back to you shortly.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm underline text-green-600 hover:text-green-800 transition"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-4 text-left">
            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={form.email}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone *"
              value={form.phone}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />

            <textarea
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
            />

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        )} */}