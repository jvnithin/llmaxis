"use client";

import { useState } from "react";
import { event as trackFbEvent } from "@/lib/fpixel";
import { countries } from "@/lib/countries";

const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_BROCHURE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbx07EJrG5Q-F-lj8SgyY-DIoNAPkiczXXyTf2VG_OQyhrVIqOoFuWE6q0ifvnb16z4L/exec";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "India",
    dialCode: "+91",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = countries.find((c) => c.name === e.target.value);
    setForm((prev) => ({
      ...prev,
      country: e.target.value,
      dialCode: selected?.dial ?? "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      name: form.name,
      email: form.email,
      country: form.country,
      phone: `${form.dialCode}${form.phone}`,
      source: "brochure_download",
    });

    try {
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      setSubmitted(true);
      trackFbEvent("Lead", {
        content_name: "Gen AI Brochure Download",
        source: "brochure_modal",
      });

      // Auto-download after submit
      const link = document.createElement("a");
      link.href = "/Brochure1.pdf";
      link.download = "LLMAxis_Brochure.pdf";
      link.click();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        email: "",
        country: "India",
        dialCode: "+91",
        phone: "",
      });
      setError("");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-xl font-bold"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Download Started!
            </h3>
            <p className="text-gray-500 text-sm">
              Your brochure is downloading. We&apos;ll be in touch soon!
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Download Curriculum
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Fill in your details to get the brochure instantly.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={handleCountryChange}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition appearance-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Auto-updated dial code */}
                  <div className="flex items-center justify-center border border-gray-200 bg-purple-50 rounded-xl px-3 text-sm font-semibold text-purple-700 min-w-[64px]">
                    {form.dialCode}
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0000000000"
                    className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Please wait..." : "Curriculum"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
