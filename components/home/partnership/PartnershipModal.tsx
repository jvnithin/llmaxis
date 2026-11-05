"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { event as trackFbEvent } from "@/lib/fpixel";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
} from "@/lib/countries";
import {
  OTHER_PARTNERSHIP,
  PARTNERSHIP_TYPES,
  emptyPartnershipInquiry,
  validatePartnershipInquiry,
  type PartnershipInquiry,
} from "@/lib/partnershipForm";
import { useToast } from "@/components/ui/toast";
import "../business-enquiry/business-enquiry.css";
import "./partnership.css";

type PartnershipModalProps = {
  onClose: () => void;
};

export default function PartnershipModal({ onClose }: PartnershipModalProps) {
  const toast = useToast();
  const titleId = useId();
  const customRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const detailsRef = useRef<PartnershipInquiry>(emptyPartnershipInquiry);
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState<PartnershipInquiry>(emptyPartnershipInquiry);
  const [errors, setErrors] = useState<Partial<Record<keyof PartnershipInquiry, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  onCloseRef.current = onClose;
  detailsRef.current = details;
  const selectedCountry = getCountry(details.country);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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
  }, [loading]);

  useEffect(() => {
    if (details.partnership === OTHER_PARTNERSHIP) customRef.current?.focus();
  }, [details.partnership]);

  function update(next: PartnershipInquiry) {
    detailsRef.current = next;
    setDetails(next);
    setSubmitError("");
    setErrors((current) => {
      const checked = validatePartnershipInquiry(next);
      const updated = { ...current };
      (Object.keys(current) as (keyof PartnershipInquiry)[]).forEach((field) => {
        if (current[field]) updated[field] = checked[field];
      });
      return updated;
    });
  }

  function blur(field: keyof PartnershipInquiry) {
    const checked = validatePartnershipInquiry(detailsRef.current);
    setErrors((current) => ({ ...current, [field]: checked[field] }));
  }

  function updateCountry(name: string) {
    const country = getCountry(name);
    update({
      ...detailsRef.current,
      country: name,
      phone: country ? sanitizeNationalNumber(detailsRef.current.phone, country) : "",
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
    const nextErrors = validatePartnershipInquiry(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/partnership", {
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
        content_name: details.partnership || "Partnership",
        source: "partnership_inquiry",
      });
      toast.success(
        "Inquiry received",
        "Our team will review your inquiry and get in touch.",
      );
      setDetails(emptyPartnershipInquiry);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const fallback = "Something went wrong while sending. Please try again.";
      const finalMessage =
        message && message !== "Request failed" ? message : fallback;
      setSubmitError(finalMessage);
      toast.error("Could not send inquiry", finalMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

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
            <p className="enquiry-kicker">Partnerships</p>
            <h3 id={titleId}>Partner with us</h3>
            <p>Tell us about your organization and how you would like to work together.</p>
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
            <section className="partnership-section">
              <h4>Your Details</h4>
              <div className="enquiry-fields">
                <label>
                  <span className="partnership-label">
                    Full Name <span className="partnership-required">*</span>
                  </span>
                  <input
                    value={details.fullName}
                    onChange={(event) => update({ ...details, fullName: event.target.value })}
                    onBlur={() => blur("fullName")}
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName ? <small>{errors.fullName}</small> : null}
                </label>
                <label>
                  <span className="partnership-label">
                    Organization / Company Name <span className="partnership-required">*</span>
                  </span>
                  <input
                    value={details.organization}
                    onChange={(event) => update({ ...details, organization: event.target.value })}
                    onBlur={() => blur("organization")}
                    autoComplete="organization"
                    maxLength={120}
                    aria-invalid={Boolean(errors.organization)}
                  />
                  {errors.organization ? <small>{errors.organization}</small> : null}
                </label>
                <label>
                  <span className="partnership-label">
                    Official Email Address <span className="partnership-required">*</span>
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
                    Contact Number <span className="partnership-required">*</span>
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
              </div>
            </section>

            <section className="partnership-section">
              <h4>Partnership Details</h4>
              <div className="enquiry-fields">
                <label>
                  <span className="partnership-label">
                    How would you like to partner with us? <span className="partnership-required">*</span>
                  </span>
                  <select
                    value={details.partnership}
                    onChange={(event) =>
                      update({
                        ...details,
                        partnership: event.target.value,
                        customPartnership:
                          event.target.value === OTHER_PARTNERSHIP ? details.customPartnership : "",
                      })
                    }
                    onBlur={() => blur("partnership")}
                    aria-invalid={Boolean(errors.partnership)}
                  >
                    <option value="">Select a partnership type</option>
                    {PARTNERSHIP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.partnership ? <small>{errors.partnership}</small> : null}
                </label>

                {details.partnership === OTHER_PARTNERSHIP ? (
                  <label>
                    <span className="partnership-label">
                      Your partnership type <span className="partnership-required">*</span>
                    </span>
                    <input
                      ref={customRef}
                      value={details.customPartnership}
                      onChange={(event) => update({ ...details, customPartnership: event.target.value })}
                      onBlur={() => blur("customPartnership")}
                      maxLength={80}
                      placeholder="Enter how you would like to partner"
                      aria-invalid={Boolean(errors.customPartnership)}
                    />
                    {errors.customPartnership ? <small>{errors.customPartnership}</small> : null}
                  </label>
                ) : null}

                <label>
                  Tell us a little about your proposal
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={details.proposal}
                    onChange={(event) => update({ ...details, proposal: event.target.value })}
                    onBlur={() => blur("proposal")}
                    placeholder="Share the partnership you have in mind"
                    aria-invalid={Boolean(errors.proposal)}
                  />
                  {errors.proposal ? <small>{errors.proposal}</small> : null}
                </label>
              </div>
            </section>

            <p className="partnership-consent">
              By submitting this form, you agree to our{" "}
              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>{" "}
              and consent to being contacted regarding your partnership inquiry.
            </p>

            {submitError ? <p className="enquiry-submit-error">{submitError}</p> : null}

            <button type="submit" className="enquiry-primary partnership-submit" disabled={loading}>
              {loading ? "Sending..." : "Submit Partnership Inquiry"}
            </button>
            <p className="partnership-note">Our team will review your inquiry and get in touch.</p>
          </form>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
