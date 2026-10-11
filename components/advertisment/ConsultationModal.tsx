"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Calendar, Sparkles } from "lucide-react";
import { ConsultationFormData } from "./types";
import { event as trackFbEvent } from "@/lib/fpixel";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw0UjyDVuh39VtJsBdwRh1vTC6G2q10r5OmbeOVZ11_6tfBx5Ssw2wwr31wZ_3mmaL0KA/exec";

interface ConsultationModalProps {
  isOpen: boolean;
  initialProgram?: string;
  onClose: () => void;
}

export default function ConsultationModal({
  isOpen,
  initialProgram = "Gen AI Foundation",
  onClose,
}: ConsultationModalProps) {
  const [form, setForm] = useState<ConsultationFormData>({
    name: "",
    email: "",
    phone: "",
    program: initialProgram,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialProgram) {
      setForm((prev) => ({ ...prev, program: initialProgram }));
    }
  }, [initialProgram]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      program: form.program,
      message: form.message || `Interested in ${form.program}`,
    });

    try {
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`);
      setSubmitted(true);
      trackFbEvent("Lead", {
        content_name: form.program,
        source: "advertisment_consultation_modal",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-[#0F172A] p-5 sm:p-6 text-white relative flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-white/20 rounded-lg">
              <Calendar className="w-4 h-4 text-purple-200" />
            </span>
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-purple-200">
              Free 1-on-1 Session
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white">Book a Free Consultation</h3>
          <p className="text-[11px] sm:text-xs text-purple-100 mt-1">
            Get personalized career roadmap & AI program guidance from top mentors.
          </p>
        </div>

        {/* Modal Body - Scrollable on small screens */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                Consultation Booked!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                Thank you, <strong>{form.name}</strong>. Our senior AI career advisor
                will contact you shortly on <strong>{form.phone}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 bg-[#0F172A] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Program of Interest
                </label>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition bg-white"
                >
                  <option value="Gen AI Foundation">Gen AI Foundation</option>
                  <option value="LLM Engineering">LLM Engineering</option>
                  <option value="RAG & Vector Databases">RAG & Vector Databases</option>
                  <option value="AI Agent & Automation">AI Agent & Automation</option>
                  <option value="General AI Career Guidance">General AI Career Guidance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Learning Goal / Message (Optional)
                </label>
                <textarea
                  name="message"
                  rows={2}
                  placeholder="Tell us about your background or target role..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs font-semibold">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm Free Consultation</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
