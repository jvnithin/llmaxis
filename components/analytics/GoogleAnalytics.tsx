import Script from "next/script";
import { Suspense } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import GoogleAnalyticsRouteTracker from "./GoogleAnalyticsRouteTracker";

/**
 * Google tag (gtag.js) — deferred so it does not block first paint (FCP/LCP).
 */
export function GoogleTagScripts() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        id="google-tag-js"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: true });
          `,
        }}
      />
    </>
  );
}

/** SPA route pageview tracker for the document body. */
export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsRouteTracker />
    </Suspense>
  );
}
