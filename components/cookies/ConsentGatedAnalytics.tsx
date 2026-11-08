"use client";

import GoogleAnalytics, {
  GoogleTagScripts,
} from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import { useCookieConsent } from "./CookieConsentProvider";

export default function ConsentGatedAnalytics() {
  const { ready, preferences } = useCookieConsent();

  if (!ready) return null;

  return (
    <>
      {preferences.analytics ? (
        <>
          <GoogleTagScripts />
          <GoogleAnalytics />
        </>
      ) : null}
      {preferences.marketing ? <MetaPixel /> : null}
    </>
  );
}
