export const COOKIE_CONSENT_STORAGE_KEY = "llmaxis_cookie_consent_v1";

export type CookieConsentPreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentState = {
  decided: boolean;
  preferences: CookieConsentPreferences;
  updatedAt: string | null;
};

export const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export const ACCEPTED_COOKIE_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
};

export function createUndecidedConsentState(): CookieConsentState {
  return {
    decided: false,
    preferences: { ...DEFAULT_COOKIE_PREFERENCES },
    updatedAt: null,
  };
}

export function readCookieConsent(): CookieConsentState {
  if (typeof window === "undefined") return createUndecidedConsentState();

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return createUndecidedConsentState();

    const parsed = JSON.parse(raw) as Partial<CookieConsentState> & {
      preferences?: Partial<CookieConsentPreferences>;
    };

    return {
      decided: Boolean(parsed.decided),
      preferences: {
        necessary: true,
        analytics: Boolean(parsed.preferences?.analytics),
        marketing: Boolean(parsed.preferences?.marketing),
      },
      updatedAt:
        typeof parsed.updatedAt === "string" && parsed.updatedAt
          ? parsed.updatedAt
          : null,
    };
  } catch {
    return createUndecidedConsentState();
  }
}

export function writeCookieConsent(
  preferences: CookieConsentPreferences,
): CookieConsentState {
  const next: CookieConsentState = {
    decided: true,
    preferences: {
      necessary: true,
      analytics: Boolean(preferences.analytics),
      marketing: Boolean(preferences.marketing),
    },
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent("llmaxis:cookie-consent", { detail: next }),
    );
  }

  return next;
}
