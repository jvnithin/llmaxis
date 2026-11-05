"use client";

import { useState, type FormEvent } from "react";
import { validateEmail, validateName } from "@/lib/communityForm";
import { countries, getCountry, mobileLength, mobileLengthLabel, sanitizeNationalNumber, validateMobile } from "@/lib/countries";
import { useToast } from "@/components/ui/toast";

const PROGRAMS = [
  "Gen AI Foundation",
  "LLM Engineering",
  "RAG & Vector Databases",
  "AI Agent & Automation",
  "General AI Career Guidance",
];

type Fields = {
  name: string;
  email: string;
  country: string;
  phone: string;
  program: string;
};

const emptyFields: Fields = {
  name: "",
  email: "",
  country: "",
  phone: "",
  program: PROGRAMS[0],
};

export default function GuideCounselling({
  contentTitle,
  contentKind,
  contentSlug,
  /** @deprecated use contentTitle */
  articleTitle,
}: {
  contentTitle?: string;
  contentKind?: "article" | "roadmap";
  contentSlug?: string;
  articleTitle?: string;
}) {
  const toast = useToast();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedCountry = getCountry(fields.country);
  const title = (contentTitle || articleTitle || "").trim();
  const kind = contentKind === "roadmap" ? "roadmap" : "article";

  function update(next: Fields) {
    setFields(next);
    setSubmitError("");
  }

  function validate(current: Fields) {
    const next: Partial<Record<keyof Fields, string>> = {};
    const name = validateName(current.name);
    const email = validateEmail(current.email);
    const country = getCountry(current.country) ? "" : "Select your country.";
    const phone = validateMobile(current.country, current.phone);
    if (name) next.name = name;
    if (email) next.email = email;
    if (country) next.country = country;
    if (phone) next.phone = phone === "Enter your phone or WhatsApp number." ? "Enter your mobile number." : phone;
    if (!PROGRAMS.includes(current.program)) next.program = "Choose a program.";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          program: fields.program,
          country: fields.country,
          phone: fields.phone,
          title,
          kind,
          slug: contentSlug || "",
          // Keep legacy key for older Apps Script deployments.
          article: title,
        }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        const message = body?.error || "Something went wrong. Please try again.";
        setSubmitError(message);
        toast.error("Could not send request", message);
        return;
      }
      toast.success(
        "Request received",
        "A counsellor will contact you on the details you shared.",
      );
      setFields(emptyFields);
      setErrors({});
    } catch {
      const message = "Something went wrong. Please try again.";
      setSubmitError(message);
      toast.error("Could not send request", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="guide-aside" id="guide-counselling">
      <p className="guide-aside-kicker">Free counselling</p>
      <h2>Get free career counselling</h2>
      <form onSubmit={onSubmit} noValidate>
          <label>
            Full name
            <input
              name="name"
              value={fields.name}
              onChange={(event) => update({ ...fields, name: event.target.value })}
              onBlur={() => setErrors(validate(fields))}
              autoComplete="name"
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
              value={fields.email}
              onChange={(event) => update({ ...fields, email: event.target.value })}
              onBlur={() => setErrors(validate(fields))}
              autoComplete="email"
              maxLength={120}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>
          <label>
            Program
            <select
              name="program"
              value={fields.program}
              onChange={(event) => update({ ...fields, program: event.target.value })}
            >
              {PROGRAMS.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </label>
          <label>
            Country
            <select
              name="country"
              value={fields.country}
              onChange={(event) => {
                const country = getCountry(event.target.value);
                update({
                  ...fields,
                  country: event.target.value,
                  phone: country ? sanitizeNationalNumber(fields.phone, country) : "",
                });
              }}
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
            <span className="guide-phone">
              <span className={selectedCountry ? "guide-dial" : "guide-dial is-empty"}>{selectedCountry?.dial ?? "Code"}</span>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                value={fields.phone}
                onChange={(event) => {
                  if (!selectedCountry) {
                    setErrors((current) => ({
                      ...current,
                      country: "Select your country.",
                      phone: "Select your country first.",
                    }));
                    return;
                  }
                  update({ ...fields, phone: sanitizeNationalNumber(event.target.value, selectedCountry) });
                }}
                onBlur={() => setErrors(validate(fields))}
                autoComplete="tel-national"
                placeholder={selectedCountry ? mobileLengthLabel(selectedCountry) : "Select a country first"}
                maxLength={selectedCountry ? mobileLength(selectedCountry)[1] : 15}
                disabled={!selectedCountry}
                aria-invalid={Boolean(errors.phone)}
              />
            </span>
            {errors.phone ? <small>{errors.phone}</small> : null}
          </label>
        {submitError ? <p className="guide-submit-error">{submitError}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Request a callback"}
        </button>
      </form>
    </aside>
  );
}
