"use client";

import { FormEvent, useState, type ReactNode } from "react";
import Icon from "./Icon";
import { event as trackFbEvent } from "@/lib/fpixel";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
} from "@/lib/countries";
import {
  emptyHomeInquiry,
  validateHomeInquiry,
  type HomeInquiry,
  type InquiryType,
} from "@/lib/homeInquiry";

const formTypes: InquiryType[] = ["Individuals", "Businesses"];

export default function InquiryForm() {
  const [inquiryType, setInquiryType] = useState<InquiryType>("Individuals");
  const [details, setDetails] = useState<HomeInquiry>(emptyHomeInquiry);
  const [errors, setErrors] = useState<Partial<Record<keyof HomeInquiry, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const selectedCountry = getCountry(details.country);

  function currentDetails(next: Partial<HomeInquiry> = {}) {
    return { ...details, inquiryType, ...next };
  }

  function update(next: HomeInquiry) {
    setDetails(next);
    setSubmitError("");
    setErrors((current) => refreshErrors(current, next));
  }

  function refreshErrors(
    current: Partial<Record<keyof HomeInquiry, string>>,
    next: HomeInquiry,
  ) {
    const checked = validateHomeInquiry(next);
    const updated = { ...current };
    (Object.keys(current) as (keyof HomeInquiry)[]).forEach((field) => {
      if (current[field]) updated[field] = checked[field];
    });
    return updated;
  }

  function blur(field: keyof HomeInquiry) {
    const checked = validateHomeInquiry(currentDetails());
    setErrors((current) => ({ ...current, [field]: checked[field] }));
  }

  function switchType(type: InquiryType) {
    const next = currentDetails({
      inquiryType: type,
      company: type === "Individuals" ? "" : details.company,
    });
    setInquiryType(type);
    setDetails(next);
    setSubmitError("");
    setErrors({});
  }

  function updateCountry(name: string) {
    const country = getCountry(name);
    update(
      currentDetails({
        country: name,
        phone: country ? sanitizeNationalNumber(details.phone, country) : "",
      }),
    );
  }

  function updatePhone(raw: string) {
    if (!selectedCountry) {
      setErrors((current) => ({
        ...current,
        country: "Select your country.",
        phone: "Select your country first.",
      }));
      return;
    }
    update(currentDetails({ phone: sanitizeNationalNumber(raw, selectedCountry) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = currentDetails();
    const nextErrors = validateHomeInquiry(next);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: next.inquiryType,
          name: next.name.trim().replace(/\s+/g, " "),
          email: next.email.trim(),
          company: next.inquiryType === "Businesses" ? next.company.trim().replace(/\s+/g, " ") : "",
          country: next.country,
          phone: next.phone,
          message: next.message.trim(),
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        if (payload?.fields) setErrors(payload.fields);
        throw new Error(typeof payload?.error === "string" ? payload.error : "Request failed");
      }

      trackFbEvent("Lead", {
        content_name: next.inquiryType,
        source: "home_inquiry_form",
      });
      setErrors({});
      setDetails({ ...emptyHomeInquiry, inquiryType: next.inquiryType });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setSubmitError(
        message && message !== "Request failed"
          ? message
          : "Something went wrong while sending. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-shell">
      <div className="form-tabs" role="tablist" aria-label="Inquiry type">
        {formTypes.map((type) => (
          <button
            className={inquiryType === type ? "active" : ""}
            key={type}
            type="button"
            role="tab"
            aria-selected={inquiryType === type}
            onClick={() => switchType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field label="Name" error={errors.name}>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              maxLength={80}
              value={details.name}
              aria-invalid={Boolean(errors.name)}
              onChange={(event) => update(currentDetails({ name: event.target.value }))}
              onBlur={() => blur("name")}
            />
          </Field>
          <Field label={inquiryType === "Businesses" ? "Company email" : "Email"} error={errors.email}>
            <input
              name="email"
              type="email"
              placeholder={inquiryType === "Businesses" ? "name@company.com" : "you@email.com"}
              autoComplete="email"
              maxLength={120}
              value={details.email}
              aria-invalid={Boolean(errors.email)}
              onChange={(event) => update(currentDetails({ email: event.target.value }))}
              onBlur={() => blur("email")}
            />
          </Field>
        </div>

        {inquiryType === "Businesses" ? (
          <Field label="Company" error={errors.company}>
            <input
              name="organization"
              type="text"
              placeholder="Your company name"
              autoComplete="organization"
              maxLength={120}
              value={details.company}
              aria-invalid={Boolean(errors.company)}
              onChange={(event) => update(currentDetails({ company: event.target.value }))}
              onBlur={() => blur("company")}
            />
          </Field>
        ) : null}

        <div className="form-grid">
          <Field label="Country" error={errors.country}>
            <select
              name="country"
              value={details.country}
              autoComplete="country-name"
              aria-invalid={Boolean(errors.country)}
              onChange={(event) => updateCountry(event.target.value)}
              onBlur={() => blur("country")}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name} ({country.dial})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mobile number" error={errors.phone}>
            <span className="inquiry-phone">
              <span className={selectedCountry ? "inquiry-dial" : "inquiry-dial is-empty"}>
                {selectedCountry?.dial ?? "Code"}
              </span>
              <input
                name="tel"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={selectedCountry ? mobileLengthLabel(selectedCountry) : "Select a country first"}
                maxLength={selectedCountry ? mobileLength(selectedCountry)[1] : 15}
                value={details.phone}
                disabled={!selectedCountry}
                aria-invalid={Boolean(errors.phone)}
                onChange={(event) => updatePhone(event.target.value)}
                onBlur={() => blur("phone")}
              />
            </span>
          </Field>
        </div>

        <Field label="Message" error={errors.message}>
          <textarea
            name="message"
            rows={4}
            maxLength={1000}
            placeholder={
              inquiryType === "Businesses"
                ? "Tell us about your team and AI goals."
                : "Tell us what you want to learn or achieve."
            }
            value={details.message}
            aria-invalid={Boolean(errors.message)}
            onChange={(event) => update(currentDetails({ message: event.target.value }))}
            onBlur={() => blur("message")}
          />
        </Field>

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <button
          className="button button-primary button-wide"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : <>Send inquiry <Icon name="arrow" size={19} /></>}
        </button>

        <p className="form-note">No spam. Just a focused conversation about your goals.</p>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label>
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}
