"use client";

import { useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwTzz1JGTtSDTRIytbXJV-WWz05KNufgB4AqJCPFbGwaiVdKaWg9Suu21Al4gQoOYA2pg/exec";

const countries = [
  { name: "Afghanistan", code: "AF", dial: "+93" },
  { name: "Albania", code: "AL", dial: "+355" },
  { name: "Algeria", code: "DZ", dial: "+213" },
  { name: "Argentina", code: "AR", dial: "+54" },
  { name: "Australia", code: "AU", dial: "+61" },
  { name: "Austria", code: "AT", dial: "+43" },
  { name: "Bangladesh", code: "BD", dial: "+880" },
  { name: "Belgium", code: "BE", dial: "+32" },
  { name: "Brazil", code: "BR", dial: "+55" },
  { name: "Canada", code: "CA", dial: "+1" },
  { name: "Chile", code: "CL", dial: "+56" },
  { name: "China", code: "CN", dial: "+86" },
  { name: "Colombia", code: "CO", dial: "+57" },
  { name: "Denmark", code: "DK", dial: "+45" },
  { name: "Egypt", code: "EG", dial: "+20" },
  { name: "Ethiopia", code: "ET", dial: "+251" },
  { name: "Finland", code: "FI", dial: "+358" },
  { name: "France", code: "FR", dial: "+33" },
  { name: "Germany", code: "DE", dial: "+49" },
  { name: "Ghana", code: "GH", dial: "+233" },
  { name: "Greece", code: "GR", dial: "+30" },
  { name: "Hong Kong", code: "HK", dial: "+852" },
  { name: "Hungary", code: "HU", dial: "+36" },
  { name: "India", code: "IN", dial: "+91" },
  { name: "Indonesia", code: "ID", dial: "+62" },
  { name: "Iran", code: "IR", dial: "+98" },
  { name: "Iraq", code: "IQ", dial: "+964" },
  { name: "Ireland", code: "IE", dial: "+353" },
  { name: "Israel", code: "IL", dial: "+972" },
  { name: "Italy", code: "IT", dial: "+39" },
  { name: "Japan", code: "JP", dial: "+81" },
  { name: "Jordan", code: "JO", dial: "+962" },
  { name: "Kenya", code: "KE", dial: "+254" },
  { name: "Kuwait", code: "KW", dial: "+965" },
  { name: "Malaysia", code: "MY", dial: "+60" },
  { name: "Mexico", code: "MX", dial: "+52" },
  { name: "Morocco", code: "MA", dial: "+212" },
  { name: "Myanmar", code: "MM", dial: "+95" },
  { name: "Nepal", code: "NP", dial: "+977" },
  { name: "Netherlands", code: "NL", dial: "+31" },
  { name: "New Zealand", code: "NZ", dial: "+64" },
  { name: "Nigeria", code: "NG", dial: "+234" },
  { name: "Norway", code: "NO", dial: "+47" },
  { name: "Oman", code: "OM", dial: "+968" },
  { name: "Pakistan", code: "PK", dial: "+92" },
  { name: "Philippines", code: "PH", dial: "+63" },
  { name: "Poland", code: "PL", dial: "+48" },
  { name: "Portugal", code: "PT", dial: "+351" },
  { name: "Qatar", code: "QA", dial: "+974" },
  { name: "Romania", code: "RO", dial: "+40" },
  { name: "Russia", code: "RU", dial: "+7" },
  { name: "Saudi Arabia", code: "SA", dial: "+966" },
  { name: "Singapore", code: "SG", dial: "+65" },
  { name: "South Africa", code: "ZA", dial: "+27" },
  { name: "South Korea", code: "KR", dial: "+82" },
  { name: "Spain", code: "ES", dial: "+34" },
  { name: "Sri Lanka", code: "LK", dial: "+94" },
  { name: "Sweden", code: "SE", dial: "+46" },
  { name: "Switzerland", code: "CH", dial: "+41" },
  { name: "Taiwan", code: "TW", dial: "+886" },
  { name: "Tanzania", code: "TZ", dial: "+255" },
  { name: "Thailand", code: "TH", dial: "+66" },
  { name: "Turkey", code: "TR", dial: "+90" },
  { name: "Uganda", code: "UG", dial: "+256" },
  { name: "Ukraine", code: "UA", dial: "+380" },
  { name: "United Arab Emirates", code: "AE", dial: "+971" },
  { name: "United Kingdom", code: "GB", dial: "+44" },
  { name: "United States", code: "US", dial: "+1" },
  { name: "Vietnam", code: "VN", dial: "+84" },
  { name: "Yemen", code: "YE", dial: "+967" },
  { name: "Zimbabwe", code: "ZW", dial: "+263" },
];

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
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
      setSubmitted(true);

      // Auto-download after submit
      const link = document.createElement("a");
      link.href = "/Brochure.pdf";
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
      setForm({ name: "", email: "", country: "India", dialCode: "+91", phone: "" });
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
            <div className="text-5xl mb-4">🎉</div>
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
              <p className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-full font-medium mb-3">
                Free Download
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Download Brochure
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
                  {loading ? "Please wait..." : "Download Brochure"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}