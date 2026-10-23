"use client";

import React, { FormEvent, useState } from "react";
import Icon from "./Icon";
import { event as trackFbEvent } from "@/lib/fpixel";

const formTypes = ["Individuals", "Businesses", "Course Enquiries"];

export default function InquiryForm() {
  const [activeType, setActiveType] = useState(formTypes[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Send to server-side Next.js route connected to Google Sheets
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          inquiryType: activeType,
          interest: formData.interest || "General",
          message: formData.message,
        }),
      });

      if (!res.ok) {
        // Fallback: direct call if client-side environment variable is present
        const directUrl = process.env.NEXT_PUBLIC_INQUIRY_APPS_SCRIPT_URL;
        if (directUrl) {
          const params = new URLSearchParams({
            name: formData.name,
            email: formData.email,
            inquiryType: activeType,
            interest: formData.interest || "General",
            message: formData.message,
            source: "home_inquiry_form",
            timestamp: new Date().toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            }),
          });
          await fetch(`${directUrl}?${params.toString()}`, {
            method: "GET",
            mode: "no-cors",
          });
        }
      }

      // 2. Track Lead in Meta Pixel
      trackFbEvent("Lead", {
        content_name: activeType,
        interest: formData.interest || "General",
        source: "home_inquiry_form",
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", interest: "", message: "" });
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError("Something went wrong while sending. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setError("");
    setFormData({ name: "", email: "", interest: "", message: "" });
  }

  if (submitted) {
    return (
      <div className="success-state" role="status">
        <span className="success-icon">
          <Icon name="check" size={30} />
        </span>
        <p className="eyebrow">Inquiry received</p>
        <h3>Thanks for reaching out!</h3>
        <p>
          Your inquiry has been successfully recorded. Our team will review your
          goals and connect with you shortly.
        </p>
        <button
          className="text-button"
          type="button"
          onClick={handleReset}
        >
          Submit another inquiry <Icon name="arrow" size={17} />
        </button>
      </div>
    );
  }

  return (
    <div className="form-shell">
      <div className="form-tabs" role="tablist" aria-label="Inquiry type">
        {formTypes.map((type) => (
          <button
            className={activeType === type ? "active" : ""}
            key={type}
            type="button"
            role="tab"
            aria-selected={activeType === type}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Name</span>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          <span>Interest</span>
          <select
            name="interest"
            value={formData.interest}
            onChange={handleChange}
          >
            <option value="">Select your area of interest</option>
            <option value="AI training programs">AI training programs</option>
            <option value="AI community">AI community</option>
            <option value="Job assistance">Job assistance</option>
            <option value="Corporate training">Corporate training</option>
            <option value="AI solutions">AI solutions</option>
            <option value="AI consulting">AI consulting</option>
          </select>
        </label>

        <label>
          <span>Message</span>
          <textarea
            name="message"
            rows={4}
            placeholder={
              activeType === "Businesses"
                ? "Tell us about your team and AI goals."
                : "Tell us what you want to learn or achieve."
            }
            required
            value={formData.message}
            onChange={handleChange}
          />
        </label>

        {error && (
          <p
            style={{
              color: "#EF4444",
              fontSize: "12px",
              margin: "-5px 0 0",
              fontWeight: 600,
            }}
          >
            {error}
          </p>
        )}

        <button
          className="button button-primary button-wide"
          type="submit"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              Send{" "}
              {activeType === "Course Enquiries" ? "course inquiry" : "inquiry"}{" "}
              <Icon name="arrow" size={19} />
            </>
          )}
        </button>

        <p className="form-note">
          No spam. Just a focused conversation about your goals.
        </p>
      </form>
    </div>
  );
}
