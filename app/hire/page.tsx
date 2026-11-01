"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Icon from "@/components/home/Icon";
import { event as trackFbEvent } from "@/lib/fpixel";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
} from "@/lib/countries";
import {
  HIRE_ROLES,
  OTHER_HIRE_ROLE,
  emptyHireForm,
  validateHireForm,
  type HireErrors,
  type HireForm,
} from "@/lib/hireForm";
import "./hire.css";

export default function HirePage() {
  const [form, setForm] = useState<HireForm>(emptyHireForm);
  const [errors, setErrors] = useState<HireErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const customInterestRef = useRef<HTMLInputElement>(null);
  const selectedCountry = getCountry(form.country);

  useEffect(() => {
    if (form.interest === OTHER_HIRE_ROLE) customInterestRef.current?.focus();
  }, [form.interest]);

  function update(next: HireForm) {
    setForm(next);
    setError("");
    setErrors((current) => {
      const checked = validateHireForm(next);
      const updated = { ...current };
      (Object.keys(current) as (keyof HireForm)[]).forEach((field) => {
        if (current[field]) updated[field] = checked[field];
      });
      return updated;
    });
  }

  function updateCountry(name: string) {
    const country = getCountry(name);
    update({
      ...form,
      country: name,
      phone: country ? sanitizeNationalNumber(form.phone, country) : "",
    });
  }

  function updatePhone(raw: string) {
    if (!selectedCountry) {
      setErrors((current) => ({
        ...current,
        country: "Select a country code.",
        phone: "Select a country code first.",
      }));
      return;
    }
    update({ ...form, phone: sanitizeNationalNumber(raw, selectedCountry) });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateHireForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const interest =
      form.interest === OTHER_HIRE_ROLE
        ? form.customInterest.trim().replace(/\s+/g, " ")
        : form.interest;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        if (payload?.fields) setErrors(payload.fields);
        throw new Error(typeof payload?.error === "string" ? payload.error : "Request failed");
      }

      trackFbEvent("Lead", {
        content_name: interest || "Hire Talent",
        source: "hire_talent_form",
      });
      setForm(emptyHireForm);
      setErrors({});
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "";
      setError(
        message && message !== "Request failed"
          ? message
          : "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="hire-page">
      <div className="hire-grid" aria-hidden="true" />
      <div className="hire-shell">
        <div className="hire-copy">
          <p className="hire-kicker">Hire talent</p>
          <h1>
            Hire Industry-Ready <span className="hire-accent">AI Talent</span>
          </h1>
          <p>Access a pre-vetted pool of AI engineers trained on real-world projects.</p>
          {/* <div className="hire-actions">
            <button
              type="button"
              className="hire-button hire-button-primary"
              onClick={() => document.getElementById("hire-name")?.focus()}
            >
              Book Call
            </button>
            <button
              type="button"
              className="hire-button hire-button-secondary"
              onClick={() => document.getElementById("hiring-interest")?.focus()}
            >
              View Skills
            </button>
          </div> */}
        </div>

        <form className="hire-form" onSubmit={handleSubmit} noValidate>
            <label>
              <span>Name</span>
              <input
                id="hire-name"
                name="name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                maxLength={80}
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => update({ ...form, name: event.target.value })}
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </label>

            <label>
              <span>Company name</span>
              <input
                name="company"
                type="text"
                placeholder="Your company name"
                autoComplete="organization"
                maxLength={120}
                value={form.company}
                aria-invalid={Boolean(errors.company)}
                onChange={(event) => update({ ...form, company: event.target.value })}
              />
              {errors.company ? <small>{errors.company}</small> : null}
            </label>

            <label>
              <span>Work email</span>
              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                maxLength={120}
                value={form.email}
                aria-invalid={Boolean(errors.email)}
                onChange={(event) => update({ ...form, email: event.target.value })}
              />
              {errors.email ? <small>{errors.email}</small> : null}
            </label>

            <div className="hire-row">
              <label>
                <span>Country code</span>
                <select
                  name="country"
                  value={form.country}
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                  onChange={(event) => updateCountry(event.target.value)}
                >
                  <option value="">Select country code</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name} {country.dial}
                    </option>
                  ))}
                </select>
                {errors.country ? <small>{errors.country}</small> : null}
              </label>

              <label>
                <span>Mobile number</span>
                <span className="hire-phone">
                  <span className={selectedCountry ? "hire-dial" : "hire-dial is-empty"}>
                    {selectedCountry?.dial ?? "Code"}
                  </span>
                  <input
                    name="tel"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder={
                      selectedCountry ? mobileLengthLabel(selectedCountry) : "Select a country code first"
                    }
                    maxLength={selectedCountry ? mobileLength(selectedCountry)[1] : 15}
                    value={form.phone}
                    disabled={!selectedCountry}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(event) => updatePhone(event.target.value)}
                  />
                </span>
                {errors.phone ? <small>{errors.phone}</small> : null}
              </label>
            </div>

            <label>
              <span>Hiring interest</span>
              <select
                id="hiring-interest"
                name="interest"
                value={form.interest}
                onChange={(event) =>
                  update({
                    ...form,
                    interest: event.target.value,
                    customInterest: event.target.value === OTHER_HIRE_ROLE ? form.customInterest : "",
                  })
                }
              >
                {HIRE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            {form.interest === OTHER_HIRE_ROLE ? (
              <label>
                <span>Your role</span>
                <input
                  ref={customInterestRef}
                  name="customInterest"
                  type="text"
                  placeholder="Enter the role you want to hire"
                  maxLength={80}
                  value={form.customInterest}
                  aria-invalid={Boolean(errors.customInterest)}
                  onChange={(event) => update({ ...form, customInterest: event.target.value })}
                />
                {errors.customInterest ? <small>{errors.customInterest}</small> : null}
              </label>
            ) : null}

            {error ? <p className="hire-error">{error}</p> : null}

            <button className="hire-submit" type="submit" disabled={loading}>
              {loading ? "Submitting..." : <>Submit Request <Icon name="arrow" size={18} /></>}
            </button>
          </form>
      </div>
    </section>
  );
}
