"use client";

import { FormEvent, useState } from "react";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
} from "@/lib/countries";
import {
  emptyCommunityDetails,
  validateCommunityDetails,
  type CommunityDetails,
} from "@/lib/communityForm";

export type CommunityLinks = {
  whatsapp: string;
  discord: string;
};

type CommunityJoinFormProps = {
  onSuccess: (links: CommunityLinks) => void;
};

export default function CommunityJoinForm({ onSuccess }: CommunityJoinFormProps) {
  const [details, setDetails] = useState<CommunityDetails>(emptyCommunityDetails);
  const [errors, setErrors] = useState<Partial<Record<keyof CommunityDetails, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedCountry = getCountry(details.country);

  function update(next: CommunityDetails) {
    setDetails(next);
    setSubmitError("");
    setErrors((current) => {
      const refreshed = { ...current };
      (Object.keys(current) as (keyof CommunityDetails)[]).forEach((field) => {
        if (current[field]) refreshed[field] = validateCommunityDetails(next)[field];
      });
      return refreshed;
    });
  }

  function blur(field: keyof CommunityDetails) {
    setErrors((current) => ({ ...current, [field]: validateCommunityDetails(details)[field] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCommunityDetails(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name.trim().replace(/\s+/g, " "),
          email: details.email.trim(),
          country: details.country,
          phone: details.phone,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (payload.fields) setErrors(payload.fields);
        throw new Error(payload.error || "Request failed");
      }
      onSuccess(payload.links);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="enquiry-fields">
        <label>
          Name
          <input
            name="name"
            value={details.name}
            onChange={(event) => update({ ...details, name: event.target.value })}
            onBlur={() => blur("name")}
            autoComplete="name"
            autoFocus
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <small>{errors.name}</small> : null}
        </label>
        <label>
          Email
          <input
            name="email"
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
          Country
          <select
            name="country"
            value={details.country}
            onChange={(event) => {
              const country = getCountry(event.target.value);
              update({
                ...details,
                country: event.target.value,
                phone: country ? sanitizeNationalNumber(details.phone, country) : "",
              });
            }}
            onBlur={() => blur("country")}
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
          Mobile number
          <span className="enquiry-phone">
            <span className={selectedCountry ? "enquiry-dial" : "enquiry-dial is-empty"}>
              {selectedCountry?.dial ?? "Code"}
            </span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              value={details.phone}
              onChange={(event) => {
                if (!selectedCountry) {
                  setErrors((current) => ({
                    ...current,
                    country: "Select your country.",
                    phone: "Select your country first.",
                  }));
                  return;
                }
                update({
                  ...details,
                  phone: sanitizeNationalNumber(event.target.value, selectedCountry),
                });
              }}
              onBlur={() => blur("phone")}
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
      {submitError ? <p className="enquiry-submit-error">{submitError}</p> : null}
      <div className="enquiry-actions">
        <span />
        <button className="enquiry-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Join the community"}
        </button>
      </div>
    </form>
  );
}
