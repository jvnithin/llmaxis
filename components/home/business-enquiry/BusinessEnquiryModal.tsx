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
  validateMobile,
} from "@/lib/countries";
import {
  BUSINESS_ROLES,
  EnquiryField,
  getBusinessService,
} from "./config";
import { useToast } from "@/components/ui/toast";
import "./business-enquiry.css";

type PrimaryDetails = {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  company: string;
  role: string;
};

const emptyPrimary: PrimaryDetails = {
  fullName: "",
  email: "",
  country: "",
  phone: "",
  company: "",
  role: "",
};

type BusinessEnquiryModalProps = {
  serviceTitle: string | null;
  onClose: () => void;
};

function validateFullName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  if (!name) return "Enter your full name.";
  if (name.length > 80) return "Enter a shorter full name.";
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) return "Use letters only in your full name.";
  const letters = name.replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return "Enter your full name.";
  return "";
}

function validateEmail(value: string) {
  const email = value.trim();
  if (!email) return "Enter your business email.";
  const valid =
    email.length <= 120 &&
    !email.includes("..") &&
    /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/.test(email);
  return valid ? "" : "Enter a valid business email, such as name@company.com.";
}

function validateCompany(value: string) {
  const company = value.trim();
  if (!company) return "Enter your company or organization.";
  if (company.length < 2) return "Enter the full company or organization name.";
  if (company.length > 120) return "Enter a shorter company or organization name.";
  if (!/^[\p{L}0-9][\p{L}0-9 .,&'’()/+\-]*$/u.test(company)) {
    return "Use letters, numbers, and standard punctuation in the company name.";
  }
  return "";
}

function primaryError(field: keyof PrimaryDetails, details: PrimaryDetails) {
  if (field === "fullName") return validateFullName(details.fullName);
  if (field === "email") return validateEmail(details.email);
  if (field === "country") return getCountry(details.country) ? "" : "Select your country.";
  if (field === "phone") return validateMobile(details.country, details.phone);
  if (field === "company") return validateCompany(details.company);
  if (field === "role") {
    return (BUSINESS_ROLES as readonly string[]).includes(details.role)
      ? ""
      : "Select your current role.";
  }
  return "";
}

function answerError(field: EnquiryField, value: string) {
  const answer = value.trim();
  if (field.required === false && !answer) return "";
  if (field.type === "select") {
    return answer && field.options?.includes(answer) ? "" : "Select an option.";
  }
  if (!answer) return "This field is required.";
  const min = field.type === "textarea" ? 10 : 2;
  const max = field.type === "textarea" ? 1000 : 160;
  if (answer.length < min) return `Enter at least ${min} characters.`;
  if (answer.length > max) return `Keep this answer under ${max} characters.`;
  if (!/[\p{L}0-9]/u.test(answer)) return "Enter a meaningful answer.";
  return "";
}

export default function BusinessEnquiryModal({
  serviceTitle,
  onClose,
}: BusinessEnquiryModalProps) {
  const toast = useToast();
  const service = serviceTitle ? getBusinessService(serviceTitle) : null;
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [primary, setPrimary] = useState<PrimaryDetails>(emptyPrimary);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const primaryRef = useRef(primary);
  primaryRef.current = primary;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStep(1);
    setPrimary(emptyPrimary);
    setAnswers({});
    setErrors({});
    setSubmitError("");
    setLoading(false);
  }, [serviceTitle]);

  useEffect(() => {
    if (!service) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [service, loading, onClose]);

  if (!service || !mounted) return null;

  function updatePrimary(field: keyof PrimaryDetails, value: string) {
    const next = { ...primaryRef.current, [field]: value };
    primaryRef.current = next;
    setPrimary(next);
    setErrors((current) => refreshErrors(current, next));
  }

  function updateCountry(name: string) {
    const selected = getCountry(name);
    const next = {
      ...primaryRef.current,
      country: name,
      phone: selected ? sanitizeNationalNumber(primaryRef.current.phone, selected) : "",
    };
    primaryRef.current = next;
    setPrimary(next);
    setErrors((current) => refreshErrors(current, next));
  }

  function updatePhone(raw: string) {
    const selected = getCountry(primaryRef.current.country);
    if (!selected) {
      setErrors((current) => ({ ...current, country: "Select your country.", phone: "Select your country first." }));
      return;
    }
    const next = { ...primaryRef.current, phone: sanitizeNationalNumber(raw, selected) };
    primaryRef.current = next;
    setPrimary(next);
    setErrors((current) => refreshErrors(current, next));
  }

  function refreshErrors(current: Record<string, string>, next: PrimaryDetails) {
    const updated = { ...current };
    (Object.keys(next) as (keyof PrimaryDetails)[]).forEach((field) => {
      if (current[field]) updated[field] = primaryError(field, next);
    });
    return updated;
  }

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      if (!current[id] || !service) return current;
      const field = service.fields.find((item) => item.id === id);
      return field ? { ...current, [id]: answerError(field, value) } : current;
    });
  }

  function validatePrimary() {
    const fields: (keyof PrimaryDetails)[] = ["fullName", "email", "country", "phone", "company", "role"];
    const nextErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const message = primaryError(field, primary);
      if (message) nextErrors[field] = message;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateAnswers() {
    if (!service) return false;
    const nextErrors: Record<string, string> = {};
    service.fields.forEach((field) => {
      const message = answerError(field, answers[field.id] || "");
      if (message) nextErrors[field.id] = message;
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submitEnquiry() {
    if (!service) return;
    setLoading(true);
    setSubmitError("");
    const selectedCountry = getCountry(primary.country);
    const formattedPhone = selectedCountry
      ? `${selectedCountry.dial} ${primary.phone.trim()}`
      : primary.phone.trim();
    const detailLines = service.fields.map(
      (field) => `${field.label} ${answers[field.id]?.trim() || "—"}`
    );
    const message = [
      `Selected service: ${service.title}`,
      `Role: ${primary.role}`,
      `Company: ${primary.company.trim()}`,
      `Country: ${primary.country.trim()}`,
      `Phone: ${formattedPhone}`,
      "",
      service.enquiryLabel,
      ...detailLines,
    ].join("\n");

    try {
      const response = await fetch("/api/business-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: primary.fullName.trim(),
          email: primary.email.trim(),
          phone: formattedPhone,
          country: primary.country.trim(),
          company: primary.company.trim(),
          role: primary.role,
          service: service.title,
          enquiryType: service.enquiryLabel,
          answers,
          message,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message = typeof payload?.error === "string" ? payload.error : "";
        throw new Error(message || "Request failed");
      }
      trackFbEvent("Lead", {
        content_name: service.title,
        source: "business_service_enquiry",
      });
      toast.success(
        "Enquiry received",
        `Thank you, ${primary.fullName.trim()}. We have your ${service.title.toLowerCase()} enquiry for ${primary.company.trim()}.`,
      );
      setPrimary(emptyPrimary);
      setAnswers({});
      setStep(1);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const fallback = "Something went wrong while sending. Please try again.";
      const finalMessage =
        message && message !== "Request failed" ? message : fallback;
      setSubmitError(finalMessage);
      toast.error("Could not send enquiry", finalMessage);
    } finally {
      setLoading(false);
    }
  }

  function blurPrimary(field: keyof PrimaryDetails) {
    setErrors((current) => ({ ...current, [field]: primaryError(field, primary) }));
  }

  const selectedCountry = getCountry(primary.country);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (validatePrimary()) setStep(2);
      return;
    }
    if (validateAnswers()) void submitEnquiry();
  }

  const dialog = (
    <div
      className="enquiry-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div
        className="enquiry-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="enquiry-header">
          <div>
            <p className="enquiry-kicker">Business enquiry</p>
            <h3 id={titleId}>
              {step === 1 ? "Tell us about you" : service.enquiryLabel}
            </h3>
            <p>
              {step === 1
                ? "This first step is the same for every business service."
                : service.objective}
            </p>
          </div>
          <button type="button" className="enquiry-close" onClick={onClose} aria-label="Close form" disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
            <div className="enquiry-progress" aria-hidden="true">
              <span className={step === 1 ? "is-active" : "is-done"}>1. Your details</span>
              <span className={step === 2 ? "is-active" : ""}>2. {service.enquiryLabel}</span>
            </div>

            {step === 1 ? (
              <div className="enquiry-fields">
                <label>
                  Full Name
                  <input
                    value={primary.fullName}
                    onChange={(event) => updatePrimary("fullName", event.target.value)}
                    onBlur={() => blurPrimary("fullName")}
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName ? <small>{errors.fullName}</small> : null}
                </label>
                <label>
                  Business Email
                  <input
                    type="email"
                    value={primary.email}
                    onChange={(event) => updatePrimary("email", event.target.value)}
                    onBlur={() => blurPrimary("email")}
                    autoComplete="email"
                    maxLength={120}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email ? <small>{errors.email}</small> : null}
                </label>
                <div className="enquiry-split">
                  <label>
                    Country / Location
                    <select
                      value={primary.country}
                      onChange={(event) => updateCountry(event.target.value)}
                      onBlur={() => blurPrimary("country")}
                      autoComplete="country-name"
                      aria-invalid={Boolean(errors.country)}
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name} ({country.dial})
                        </option>
                      ))}
                    </select>
                    {errors.country ? <small>{errors.country}</small> : null}
                  </label>
                  <label>
                    Phone / WhatsApp Number
                    <span className="enquiry-phone">
                      <span className={selectedCountry ? "enquiry-dial" : "enquiry-dial is-empty"}>
                        {selectedCountry?.dial ?? "Code"}
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={primary.phone}
                        onChange={(event) => updatePhone(event.target.value)}
                        onBlur={() => blurPrimary("phone")}
                        autoComplete="tel-national"
                        placeholder={selectedCountry ? mobileLengthLabel(selectedCountry) : "Select a country first"}
                        maxLength={selectedCountry ? mobileLength(selectedCountry)[1] : 15}
                        disabled={!selectedCountry}
                        aria-invalid={Boolean(errors.phone)}
                      />
                    </span>
                    {errors.phone ? <small>{errors.phone}</small> : null}
                  </label>
                </div>
                <label>
                  Company / Organization Name
                  <input
                    value={primary.company}
                    onChange={(event) => updatePrimary("company", event.target.value)}
                    onBlur={() => blurPrimary("company")}
                    autoComplete="organization"
                    maxLength={120}
                    aria-invalid={Boolean(errors.company)}
                  />
                  {errors.company ? <small>{errors.company}</small> : null}
                </label>
                <label>
                  Your Current Role
                  <select
                    value={primary.role}
                    onChange={(event) => updatePrimary("role", event.target.value)}
                    onBlur={() => blurPrimary("role")}
                    aria-invalid={Boolean(errors.role)}
                  >
                    <option value="">Select your role</option>
                    {BUSINESS_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role ? <small>{errors.role}</small> : null}
                </label>
                <label>
                  Selected business
                  <input value={service.title} readOnly />
                </label>
              </div>
            ) : (
              <div className="enquiry-fields">
                {service.fields.map((field) => (
                  <DynamicField
                    key={field.id}
                    field={field}
                    value={answers[field.id] || ""}
                    error={errors[field.id]}
                    onChange={(value) => updateAnswer(field.id, value)}
                    onBlur={() =>
                      setErrors((current) => ({
                        ...current,
                        [field.id]: answerError(field, answers[field.id] || ""),
                      }))
                    }
                  />
                ))}
              </div>
            )}

            {submitError ? <p className="enquiry-submit-error">{submitError}</p> : null}

            <div className="enquiry-actions">
              {step === 2 ? (
                <button type="button" className="enquiry-secondary" onClick={() => setStep(1)} disabled={loading}>
                  Back
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="enquiry-primary" disabled={loading}>
                {loading ? "Sending..." : step === 1 ? "Next" : "Submit enquiry"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

function DynamicField({
  field,
  value,
  error,
  onChange,
  onBlur,
}: {
  field: EnquiryField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const optional = field.required === false;
  return (
    <label>
      <span>
        {field.label}
        {optional ? <em> Optional</em> : null}
      </span>
      {field.type === "select" ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} aria-invalid={Boolean(error)}>
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          rows={4}
          value={value}
          maxLength={1000}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          value={value}
          maxLength={160}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
        />
      )}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
