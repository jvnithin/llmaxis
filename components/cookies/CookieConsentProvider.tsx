"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACCEPTED_COOKIE_PREFERENCES,
  createUndecidedConsentState,
  DEFAULT_COOKIE_PREFERENCES,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentPreferences,
  type CookieConsentState,
} from "@/lib/cookieConsent";

type CookieConsentContextValue = {
  ready: boolean;
  decided: boolean;
  preferences: CookieConsentPreferences;
  openPreferences: boolean;
  setOpenPreferences: (open: boolean) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (preferences: CookieConsentPreferences) => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<CookieConsentState>(
    createUndecidedConsentState(),
  );
  const [openPreferences, setOpenPreferences] = useState(false);

  useEffect(() => {
    setState(readCookieConsent());
    setReady(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === "llmaxis_cookie_consent_v1") {
        setState(readCookieConsent());
      }
    };
    const onCustom = () => setState(readCookieConsent());

    window.addEventListener("storage", onStorage);
    window.addEventListener("llmaxis:cookie-consent", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("llmaxis:cookie-consent", onCustom);
    };
  }, []);

  const acceptAll = useCallback(() => {
    setState(writeCookieConsent(ACCEPTED_COOKIE_PREFERENCES));
    setOpenPreferences(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    setState(writeCookieConsent(DEFAULT_COOKIE_PREFERENCES));
    setOpenPreferences(false);
  }, []);

  const savePreferences = useCallback((preferences: CookieConsentPreferences) => {
    setState(writeCookieConsent(preferences));
    setOpenPreferences(false);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      decided: state.decided,
      preferences: state.preferences,
      openPreferences,
      setOpenPreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
    }),
    [
      ready,
      state.decided,
      state.preferences,
      openPreferences,
      acceptAll,
      rejectNonEssential,
      savePreferences,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return context;
}
