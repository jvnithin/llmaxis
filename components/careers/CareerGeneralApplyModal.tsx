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
import { CAREER_SOCIAL_PLATFORMS } from "@/lib/careerApplication";
import {
  createGeneralSocialLink,
  emptyGeneralApplication,
  formatGeneralSocialLinks,
  generalApplicationHasErrors,
  validateGeneralApplication,
  type GeneralApplication,
  type GeneralApplicationErrors,
} from "@/lib/generalApplication";
import { useToast } from "@/components/ui/toast";
import "@/components/home/business-enquiry/business-enquiry.css";
import "@/components/home/partnership/partnership.css";
import "./careers.css";

const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GENERAL_APPLICATION_APPS_SCRIPT_URL || "";

const MAX_SOCIAL_LINKS = 8;

type CareerGeneralApplyModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function CareerGeneralApplyModal({
  open,
  onClose,
}: CareerGeneralApplyModalProps) {
  const toast = useToast();
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const detailsRef = useRef<GeneralApplication>(emptyGeneralApplication());
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState<GeneralApplication>(
    emptyGeneralApplication(),
  );
  const [errors, setErrors] = useState<GeneralApplicationErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  onCloseRef.current = onClose;
  detailsRef.current = details;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const next = emptyGeneralApplication();
    setDetails(next);
    detailsRef.current = next;
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

  function update(next: GeneralApplication) {
    detailsRef.current = next;
    setDetails(next);
    setSubmitError("");
    setErrors((current) => {
      const checked = validateGeneralApplication(next);
      const updated: GeneralApplicationErrors = {};
      (Object.keys(current) as (keyof GeneralApplicationErrors)[]).forEach(
        (field) => {
          if (field === "socialLinks") {
            if (!current.socialLinks) return;
            const nextSocial: NonNullable<
              GeneralApplicationErrors["socialLinks"]
            > = {};
            Object.keys(current.socialLinks).forEach((id) => {
              if (checked.socialLinks?.[id]) {
                nextSocial[id] = checked.socialLinks[id];
              }
            });
            if (Object.keys(nextSocial).length > 0) {
              updated.socialLinks = nextSocial;
            }
            return;
          }
          if (current[field]) updated[field] = checked[field];
        },
      );
      return updated;
    });
  }

  function blur(field: Exclude<keyof GeneralApplication, "socialLinks">) {
    const checked = validateGeneralApplication(detailsRef.current);
    setErrors((current) => ({ ...current, [field]: checked[field] }));
  }

  function blurSocial(id: string, field: "platform" | "url") {
    const checked = validateGeneralApplication(detailsRef.current);
    setErrors((current) => {
      const row = checked.socialLinks?.[id];
      const nextSocial = { ...(current.socialLinks ?? {}) };
      if (!row?.[field]) {
        if (nextSocial[id]) {
          const cleaned = { ...nextSocial[id] };
          delete cleaned[field];
          if (!cleaned.platform && !cleaned.url) delete nextSocial[id];
          else nextSocial[id] = cleaned;
        }
      } else {
        nextSocial[id] = { ...(nextSocial[id] ?? {}), [field]: row[field] };
      }
      return {
        ...current,
        socialLinks: Object.keys(nextSocial).length ? nextSocial : undefined,
      };
    });
  }

  function updateCountry(name: string) {
    const country = getCountry(name);
    const current = detailsRef.current;
    update({
      ...current,
      country: name,
      phone: country ? sanitizeNationalNumber(current.phone, country) : "",
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
    update({
      ...detailsRef.current,
      phone: sanitizeNationalNumber(raw, country),
    });
  }

  function addSocialLink() {
    if (detailsRef.current.socialLinks.length >= MAX_SOCIAL_LINKS) {
      toast.info(
        "Link limit reached",
        `You can add up to ${MAX_SOCIAL_LINKS} social links.`,
      );
      return;
    }
    update({
      ...detailsRef.current,
      socialLinks: [...detailsRef.current.socialLinks, createGeneralSocialLink()],
    });
  }

  function updateSocialLink(
    id: string,
    patch: Partial<{ platform: string; url: string }>,
  ) {
    update({
      ...detailsRef.current,
      socialLinks: detailsRef.current.socialLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link,
      ),
    });
  }

  function removeSocialLink(id: string) {
    update({
      ...detailsRef.current,
      socialLinks: detailsRef.current.socialLinks.filter((link) => link.id !== id),
    });
    setErrors((current) => {
      if (!current.socialLinks?.[id]) return current;
      const nextSocial = { ...current.socialLinks };
      delete nextSocial[id];
      return {
        ...current,
        socialLinks: Object.keys(nextSocial).length ? nextSocial : undefined,
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateGeneralApplication(details);
    setErrors(nextErrors);
    if (generalApplicationHasErrors(nextErrors)) return;

    const country = getCountry(details.country);
    if (!country) return;

    setLoading(true);
    setSubmitError("");

    const formattedPhone = `${country.dial} ${details.phone.trim()}`;
    const params = new URLSearchParams({
      name: details.name.trim(),
      email: details.email.trim(),
      country: details.country,
      phone: formattedPhone,
      message: details.message.trim(),
      resume_url: details.resumeUrl.trim(),
      social_links: formatGeneralSocialLinks(details.socialLinks),
      source: "careers_general_application",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    try {
      if (!APPS_SCRIPT_URL) {
        throw new Error(
          "General application form is not configured. Add NEXT_PUBLIC_GENERAL_APPLICATION_APPS_SCRIPT_URL.",
        );
      }

      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });

      trackFbEvent("Lead", {
        content_name: "General Application",
        source: "careers_general_application",
      });
      toast.success(
        "Application submitted",
        "Thanks — our team will review your profile shortly.",
      );
      setDetails(emptyGeneralApplication());
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const fallback = "Something went wrong while sending. Please try again.";
      const finalMessage =
        message && !message.includes("Request failed") ? message : fallback;
      setSubmitError(finalMessage);
      toast.error("Could not submit application", finalMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!open || !mounted) return null;

  const selectedCountry = getCountry(details.country);

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
            <p className="enquiry-kicker">Careers</p>
            <h3 id={titleId}>General application</h3>
            <p>
              Share your details and specialisation. We&apos;ll route this to the
              hiring team.
            </p>
          </div>
          <button
            type="button"
            className="enquiry-close"
            onClick={onClose}
            aria-label="Close form"
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
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
                onChange={(event) =>
                  update({ ...details, name: event.target.value })
                }
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
                onChange={(event) =>
                  update({ ...details, email: event.target.value })
                }
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
                <span
                  className={
                    selectedCountry ? "enquiry-dial" : "enquiry-dial is-empty"
                  }
                >
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
                    selectedCountry
                      ? mobileLengthLabel(selectedCountry)
                      : "Select your country first"
                  }
                  maxLength={
                    selectedCountry ? mobileLength(selectedCountry)[1] : 15
                  }
                  disabled={!selectedCountry}
                  aria-invalid={Boolean(errors.phone)}
                />
              </span>
              {errors.phone ? <small>{errors.phone}</small> : null}
            </label>

            <label>
              <span className="partnership-label">
                Message <span className="partnership-required">*</span>
              </span>
              <textarea
                value={details.message}
                onChange={(event) =>
                  update({ ...details, message: event.target.value })
                }
                onBlur={() => blur("message")}
                placeholder="What they are specialised in"
                rows={4}
                maxLength={1000}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? <small>{errors.message}</small> : null}
            </label>

            <label>
              <span className="partnership-label">
                Resume URL <span className="partnership-required">*</span>
              </span>
              <input
                type="url"
                inputMode="url"
                value={details.resumeUrl}
                onChange={(event) =>
                  update({ ...details, resumeUrl: event.target.value })
                }
                onBlur={() => blur("resumeUrl")}
                placeholder="https://drive.google.com/file/..."
                maxLength={500}
                aria-invalid={Boolean(errors.resumeUrl)}
              />
              {errors.resumeUrl ? <small>{errors.resumeUrl}</small> : null}
            </label>

            <div className="career-social-block">
              <div className="career-social-heading">
                <span className="partnership-label">Social media</span>
                <span className="career-social-optional">Optional</span>
              </div>

              {details.socialLinks.map((link, index) => {
                const rowErrors = errors.socialLinks?.[link.id];
                return (
                  <div key={link.id} className="career-social-row">
                    <div className="career-social-row-top">
                      <span className="career-social-row-label">
                        Link {index + 1}
                      </span>
                      <button
                        type="button"
                        className="career-social-remove"
                        onClick={() => removeSocialLink(link.id)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="career-social-grid">
                      <label>
                        <span className="partnership-label">
                          Platform <span className="partnership-required">*</span>
                        </span>
                        <input
                          type="text"
                          list={`general-social-platforms-${link.id}`}
                          value={link.platform}
                          onChange={(event) =>
                            updateSocialLink(link.id, {
                              platform: event.target.value,
                            })
                          }
                          onBlur={() => blurSocial(link.id, "platform")}
                          placeholder="LinkedIn, Medium, Discord..."
                          maxLength={40}
                          autoComplete="off"
                          aria-invalid={Boolean(rowErrors?.platform)}
                        />
                        <datalist id={`general-social-platforms-${link.id}`}>
                          {CAREER_SOCIAL_PLATFORMS.map((platform) => (
                            <option key={platform} value={platform} />
                          ))}
                        </datalist>
                        {rowErrors?.platform ? (
                          <small>{rowErrors.platform}</small>
                        ) : null}
                      </label>
                      <label>
                        <span className="partnership-label">
                          Profile URL{" "}
                          <span className="partnership-required">*</span>
                        </span>
                        <input
                          type="url"
                          inputMode="url"
                          value={link.url}
                          onChange={(event) =>
                            updateSocialLink(link.id, {
                              url: event.target.value,
                            })
                          }
                          onBlur={() => blurSocial(link.id, "url")}
                          placeholder="https://linkedin.com/in/..."
                          maxLength={500}
                          aria-invalid={Boolean(rowErrors?.url)}
                        />
                        {rowErrors?.url ? <small>{rowErrors.url}</small> : null}
                      </label>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="career-social-add"
                onClick={addSocialLink}
                disabled={loading || details.socialLinks.length >= MAX_SOCIAL_LINKS}
              >
                + Add links
              </button>
            </div>
          </div>

          {submitError ? <p className="enquiry-submit-error">{submitError}</p> : null}

          <button
            type="submit"
            className="enquiry-primary partnership-submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
