"use client";

import { Suspense, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { event as trackFbEvent } from "@/lib/fpixel";
import {
  countries,
  getCountry,
  mobileLength,
  mobileLengthLabel,
  sanitizeNationalNumber,
  validateMobile,
} from "@/lib/countries";
import { useToast } from "@/components/ui/toast";

type ContactDetail = {
  label: string;
  value: string | string[];
  href?: string | string[];
  /** When set, clicking the value copies this text instead of navigating. */
  copyText?: string;
};

const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_CONTACT_APPS_SCRIPT_URL ||
  "";

const MAPS_LINK = "https://maps.app.goo.gl/c4d3fPKwLtfvNUbm9";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hey we would like to connect and know more details about the llmsaxis",
);
const whatsappHref = (digits: string) =>
  `https://wa.me/${digits}?text=${WHATSAPP_MESSAGE}`;

const DEFAULT_COUNTRY = getCountry("India") ?? countries[0];

const contactDetails: ContactDetail[] = [
  {
    label: "Merchant Legal Entity",
    value: "LLM AXIS PRIVATE LIMITED",
  },
  {
    label: "Address",
    value:
      "Innov8 Mantri Commercio, Tower A, 5th Floor, Deeta, Bellandur, Bangalore, Bangalore South, Karnataka, India, 560103",
    copyText: MAPS_LINK,
  },
  {
    label: "Telephone No",
    value: ["+91 8309782214", "+91 6300205469"],
    href: [whatsappHref("918309782214"), whatsappHref("916300205469")],
  },
  {
    label: "E-Mail ID",
    value: "team@llmaxis.in",
    href: "mailto:Contact@llmaxis.in",
  },
];

const inputClass =
  "w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

export default function ContactPage() {
  return (
    <Suspense fallback={<main className="bg-white pt-28 pb-20" aria-busy="true" />}>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: DEFAULT_COUNTRY.name,
    dialCode: DEFAULT_COUNTRY.dial,
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ country?: string; phone?: string }>({});

  const selectedCountry = useMemo(() => getCountry(form.country), [form.country]);
  const phoneMaxLength = selectedCountry ? mobileLength(selectedCountry)[1] : 15;

  useEffect(() => {
    const role = searchParams.get("role")?.trim();
    const source = searchParams.get("source")?.trim();
    if (!role || source !== "careers") return;

    setForm((prev) => {
      if (prev.message.trim()) return prev;
      return {
        ...prev,
        message: `I'd like to apply for the ${role} role at LLM Axis.`,
      };
    });
  }, [searchParams]);

  const clearErrors = () => {
    if (error) setError("");
    if (fieldErrors.country || fieldErrors.phone) setFieldErrors({});
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const country = getCountry(e.target.value);
    setForm((prev) => ({
      ...prev,
      country: e.target.value,
      dialCode: country?.dial ?? "",
      phone: country ? sanitizeNationalNumber(prev.phone, country) : "",
    }));
    clearErrors();
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedCountry) {
      setFieldErrors({
        country: "Select your country.",
        phone: "Select your country first.",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      phone: sanitizeNationalNumber(e.target.value, selectedCountry),
    }));
    clearErrors();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.info("Link copied", "Google Maps location is on your clipboard.");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("Copy failed", "Could not copy the location link.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    const countryError = getCountry(form.country) ? "" : "Select your country.";
    const phoneError = validateMobile(form.country, form.phone);
    if (countryError || phoneError) {
      setFieldErrors({
        country: countryError || undefined,
        phone: phoneError
          ? phoneError === "Enter your phone or WhatsApp number."
            ? "Enter your mobile number."
            : phoneError
          : undefined,
      });
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    const formattedPhone = `${form.dialCode} ${form.phone.trim()}`;
    const params = new URLSearchParams({
      name: form.name.trim(),
      email: form.email.trim(),
      country: form.country,
      phone: formattedPhone,
      message: form.message.trim(),
      source: "contact_us_form",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    try {
      if (!APPS_SCRIPT_URL) {
        throw new Error("Contact form is not configured.");
      }

      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      trackFbEvent("Contact", {
        content_name: "Contact Us Form",
      });
      setForm({
        name: "",
        email: "",
        country: DEFAULT_COUNTRY.name,
        dialCode: DEFAULT_COUNTRY.dial,
        phone: "",
        message: "",
      });
      toast.success("Submitted successfully", "We'll get back to you shortly.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", "Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section
        className="min-h-screen flex items-center justify-center px-4 md:px-6 pt-28 pb-20 md:py-24"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(68, 187, 255, 0.1), transparent 24rem), radial-gradient(circle at 88% 12%, rgba(140, 84, 247, 0.14), transparent 28rem), linear-gradient(to bottom, #f8f9ff, #ffffff 72%)",
        }}
      >
        <div className="bg-white rounded-3xl p-6 md:p-10 max-w-5xl w-full shadow-sm grid md:grid-cols-2 gap-6 md:gap-10">
          {/* LEFT FORM */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="sr-only" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Name *"
                autoComplete="name"
                required
              />

              <label className="sr-only" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="Email *"
                autoComplete="email"
                required
              />

              <div>
                <label className="sr-only" htmlFor="contact-country">
                  Country
                </label>
                <select
                  id="contact-country"
                  name="country"
                  value={form.country}
                  onChange={handleCountryChange}
                  autoComplete="country-name"
                  aria-invalid={Boolean(fieldErrors.country)}
                  className={`${inputClass} cursor-pointer bg-white`}
                  required
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name} ({country.dial})
                    </option>
                  ))}
                </select>
                {fieldErrors.country ? (
                  <p className="mt-1.5 text-red-500 text-xs font-medium">{fieldErrors.country}</p>
                ) : null}
              </div>

              <div>
                <label className="sr-only" htmlFor="contact-phone">
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <div
                    className="flex min-w-[72px] items-center justify-center rounded-lg border border-gray-300 bg-purple-50 px-3 text-sm font-semibold text-purple-700 select-none"
                    aria-hidden="true"
                  >
                    {form.dialCode || "Code"}
                  </div>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className={`${inputClass} flex-1`}
                    placeholder={
                      selectedCountry
                        ? mobileLengthLabel(selectedCountry)
                        : "Select a country first"
                    }
                    maxLength={phoneMaxLength}
                    autoComplete="tel-national"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    disabled={!selectedCountry}
                    required
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="mt-1.5 text-red-500 text-xs font-medium">{fieldErrors.phone}</p>
                ) : (
                  <p className="mt-1.5 text-gray-400 text-xs">
                    Digits only — country code is added automatically.
                  </p>
                )}
              </div>

              <label className="sr-only" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Message (optional)"
              />

              {error ? <p className="text-red-500 text-sm font-medium">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-black py-3 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>

          {/* RIGHT: Contact Info */}
          <div className="bg-white rounded-2xl p-5 md:p-8 flex flex-col justify-center">
            <p className="text-lg font-semibold text-gray-800 mb-2">Contact Information</p>

            <p className="text-gray-500 text-xs mb-6">
              You may contact us using the information below:
            </p>

            <div className="space-y-4">
              {contactDetails.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[minmax(10.5rem,42%)_minmax(0,1fr)] gap-y-1 gap-x-4 items-start"
                >
                  <p className="text-xs font-medium text-gray-500 sm:whitespace-nowrap">
                    {item.label}&nbsp;:
                  </p>

                  <div className="min-w-0 text-left">
                    {item.copyText ? (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.copyText!)}
                        className="text-left text-sm font-medium text-gray-800 leading-snug break-words hover:underline cursor-pointer"
                        title="Copy location link"
                        aria-label="Copy Google Maps location link"
                      >
                        {item.value as string}
                      </button>
                    ) : Array.isArray(item.value) && Array.isArray(item.href) ? (
                      <div className="flex flex-col gap-1 text-sm font-medium text-gray-800">
                        {item.value.map((val, idx) => (
                          <a
                            key={idx}
                            href={(item.href as string[])[idx]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-words hover:underline"
                          >
                            {val}
                          </a>
                        ))}
                      </div>
                    ) : item.href ? (
                      <a
                        href={item.href as string}
                        className="text-sm font-medium text-gray-800 break-words hover:underline"
                      >
                        {item.value as string}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-gray-800 leading-snug break-words">
                        {item.value as string}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
