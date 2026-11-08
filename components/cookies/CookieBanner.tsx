"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookieConsent } from "./CookieConsentProvider";
import type { CookieConsentPreferences } from "@/lib/cookieConsent";
import "./cookie-consent.css";

export default function CookieBanner() {
  const {
    ready,
    decided,
    preferences,
    openPreferences,
    setOpenPreferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
  } = useCookieConsent();

  const [draft, setDraft] = useState<CookieConsentPreferences>(preferences);
  const visible = ready && (!decided || openPreferences);

  useEffect(() => {
    if (openPreferences) setDraft(preferences);
  }, [openPreferences, preferences]);

  if (!visible) return null;

  return (
    <aside
      className="cookie-banner"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="cookie-banner-copy">
        <h2 id="cookie-banner-title">We use cookies</h2>
        <p id="cookie-banner-desc">
          We use necessary cookies to run the site, and optional analytics and marketing
          cookies to improve LLM Axis and measure campaigns.{" "}
          <Link href="/privacy-policy">Read our Privacy Policy</Link>.
        </p>
      </div>

      {openPreferences ? (
        <div className="cookie-prefs">
          <div className="cookie-pref-row">
            <div>
              <h3>Necessary</h3>
              <p>Required for basic site operation and security. Always on.</p>
            </div>
            <span className="cookie-pref-locked">Always on</span>
          </div>

          <div className="cookie-pref-row">
            <div>
              <h3>Analytics</h3>
              <p>Helps us understand traffic and improve pages (Google tag).</p>
            </div>
            <label className="cookie-pref-toggle">
              <input
                type="checkbox"
                checked={draft.analytics}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    analytics: event.target.checked,
                  }))
                }
              />
              Allow
            </label>
          </div>

          <div className="cookie-pref-row">
            <div>
              <h3>Marketing</h3>
              <p>Used for ads and remarketing measurement (Meta Pixel).</p>
            </div>
            <label className="cookie-pref-toggle">
              <input
                type="checkbox"
                checked={draft.marketing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    marketing: event.target.checked,
                  }))
                }
              />
              Allow
            </label>
          </div>
        </div>
      ) : null}

      <div className="cookie-banner-actions">
        {openPreferences ? (
          <>
            <button
              type="button"
              className="cookie-banner-btn is-primary"
              onClick={() => savePreferences(draft)}
            >
              Save preferences
            </button>
            <button
              type="button"
              className="cookie-banner-btn is-secondary"
              onClick={acceptAll}
            >
              Accept all
            </button>
            <button
              type="button"
              className="cookie-banner-btn is-ghost"
              onClick={() => setOpenPreferences(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="cookie-banner-btn is-primary"
              onClick={acceptAll}
            >
              Accept all
            </button>
            <button
              type="button"
              className="cookie-banner-btn is-secondary"
              onClick={rejectNonEssential}
            >
              Reject non-essential
            </button>
            <button
              type="button"
              className="cookie-banner-btn is-ghost"
              onClick={() => setOpenPreferences(true)}
            >
              Manage preferences
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
