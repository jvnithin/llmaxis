"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { event as trackFbEvent } from "@/lib/fpixel";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
} from "@/lib/countries";
import {
  US_VISA_OPTIONS,
  emptyJobAssistanceInquiry,
  isUnitedStates,
  validateJobAssistanceInquiry,
  type JobAssistanceInquiry,
} from "@/lib/jobAssistanceInquiry";
import { useToast } from "@/components/ui/toast";
import "../business-enquiry/business-enquiry.css";
import "../partnership/partnership.css";

type JobAssistanceModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function JobAssistanceModal({ open, onClose }: JobAssistanceModalProps) {
  const toast = useToast();
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const detailsRef = useRef<JobAssistanceInquiry>(emptyJobAssistanceInquiry);
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState<JobAssistanceInquiry>(emptyJobAssistanceInquiry);
  const [errors, setErrors] = useState<Partial<Record<keyof JobAssistanceInquiry, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  onCloseRef.current = onClose;
  detailsRef.current = details;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setDetails(emptyJobAssistanceInquiry);
    detailsRef.current = emptyJobAssistanceInquiry;
    setErrors({});
    setSubmitError("");
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, loading]);

  function update(next: JobAssistanceInquiry) {
    detailsRef.current = next;
    setDetails(next);
    setSubmitError("");
    setErrors((current) => {
      const checked = validateJobAssistanceInquiry(next);
      const updated = { ...current };
      (Object.keys(current) as (keyof JobAssistanceInquiry)[]).forEach((field) => {
        if (current[field]) updated[field] = checked[field];
      });
      return updated;
    });
  }

  function blur(field: keyof JobAssistanceInquiry) {
    const checked = validateJobAssistanceInquiry(detailsRef.current);
    setErrors((current) => ({ ...current, [field]: checked[field] }));
  }

  function updateCountry(name: string) {
    const country = getCountry(name);
    const current = detailsRef.current;
    update({
      ...current,
      country: name,
      phone: country ? sanitizeNationalNumber(current.phone, country) : "",
      visa: isUnitedStates(name) ? current.visa : "",
    });
  }

  function updatePhone(raw: string) {
    const country = getCountry(detailsRef.current.country);
    if (!country) {
      setErrors((current) => ({
        ...current,
        country: "Select your country.",
        phone: "Select your country first.",
      }));
      return;
    }
    update({ ...detailsRef.current, phone: sanitizeNationalNumber(raw, country) });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateJobAssistanceInquiry(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/job-assistance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        if (payload?.fields) setErrors(payload.fields);
        throw new Error(typeof payload?.error === "string" ? payload.error : "Request failed");
      }
      trackFbEvent("Lead", {
        content_name: "AI Job Assistance",
        source: "job_assistance",
      });
      toast.success(
        "Request received",
        "Our team will review your details and get in touch.",
      );
      setDetails(emptyJobAssistanceInquiry);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const fallback = "Something went wrong while sending. Please try again.";
      const finalMessage =
        message && message !== "Request failed" ? message : fallback;
      setSubmitError(finalMessage);
      toast.error("Could not send request", finalMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!open || !mounted) return null;

  const selectedCountry = getCountry(details.country);
  const showVisa = isUnitedStates(details.country);

  const dialog = (
    <div
      className="enquiry-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="enquiry-header">
          <div>
            <p className="enquiry-kicker">Career support</p>
            <h3 id={titleId}>AI Job Assistance</h3>
            <p>Share your details and resume so we can help with your job search.</p>
          </div>
          <button
            type="button"
            className="enquiry-close"
            onClick={onClose}
            aria-label="Close form"
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
            <div className="enquiry-fields">
              <label>
                <span className="partnership-label">
                  Name <span className="partnership-required">*</span>
                </span>
                <input
                  value={details.name}
                  onChange={(event) => update({ ...details, name: event.target.value })}
                  onBlur={() => blur("name")}
                  autoComplete="name"
                  maxLength={80}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name ? <small>{errors.name}</small> : null}
              </label>
              <label>
                <span className="partnership-label">
                  Email <span className="partnership-required">*</span>
                </span>
                <input
                  type="email"
                  value={details.email}
                  onChange={(event) => update({ ...details, email: event.target.value })}
                  onBlur={() => blur("email")}
                  autoComplete="email"
                  maxLength={120}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </label>
              <label>
                <span className="partnership-label">
                  Country <span className="partnership-required">*</span>
                </span>
                <select
                  value={details.country}
                  onChange={(event) => updateCountry(event.target.value)}
                  onBlur={() => blur("country")}
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name} ({country.dial})
                    </option>
                  ))}
                </select>
                {errors.country ? <small>{errors.country}</small> : null}
              </label>
              <label>
                <span className="partnership-label">
                  Mobile number <span className="partnership-required">*</span>
                </span>
                <span className="enquiry-phone">
                  <span className={selectedCountry ? "enquiry-dial" : "enquiry-dial is-empty"}>
                    {selectedCountry?.dial ?? "Code"}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={details.phone}
                    onChange={(event) => updatePhone(event.target.value)}
                    onBlur={() => blur("phone")}
                    autoComplete="tel-national"
                    placeholder={
                      selectedCountry ? mobileLengthLabel(selectedCountry) : "Select your country first"
                    }
                    maxLength={selectedCountry ? mobileLength(selectedCountry)[1] : 15}
                    disabled={!selectedCountry}
                    aria-invalid={Boolean(errors.phone)}
                  />
                </span>
                {errors.phone ? <small>{errors.phone}</small> : null}
              </label>
              <label>
                <span className="partnership-label">
                  Resume URL <span className="partnership-required">*</span>
                </span>
                <input
                  type="url"
                  inputMode="url"
                  value={details.resumeUrl}
                  onChange={(event) => update({ ...details, resumeUrl: event.target.value })}
                  onBlur={() => blur("resumeUrl")}
                  placeholder="https://drive.google.com/file/..."
                  maxLength={500}
                  aria-invalid={Boolean(errors.resumeUrl)}
                />
                {errors.resumeUrl ? <small>{errors.resumeUrl}</small> : null}
              </label>
              {showVisa ? (
                <label>
                  <span className="partnership-label">
                    Visa <span className="partnership-required">*</span>
                  </span>
                  <select
                    value={details.visa}
                    onChange={(event) => update({ ...details, visa: event.target.value })}
                    onBlur={() => blur("visa")}
                    aria-invalid={Boolean(errors.visa)}
                  >
                    <option value="">Select your visa status</option>
                    {US_VISA_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.visa ? <small>{errors.visa}</small> : null}
                </label>
              ) : null}
            </div>

            {submitError ? <p className="enquiry-submit-error">{submitError}</p> : null}

            <button type="submit" className="enquiry-primary partnership-submit" disabled={loading}>
              {loading ? "Sending..." : "Submit request"}
            </button>
          </form>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
