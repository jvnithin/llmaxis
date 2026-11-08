"use client";

import { useCookieConsent } from "./CookieConsentProvider";

type CookieSettingsButtonProps = {
  className?: string;
};

export default function CookieSettingsButton({
  className,
}: CookieSettingsButtonProps) {
  const { setOpenPreferences } = useCookieConsent();

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpenPreferences(true)}
    >
      Cookie Settings
    </button>
  );
}
