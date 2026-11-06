import Script from "next/script";
import { Suspense } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/gtag";
import GoogleAnalyticsRouteTracker from "./GoogleAnalyticsRouteTracker";

/**
 * Google tag (gtag.js) scripts for `<head>`.
 * Install once, immediately after the opening `<head>` tag.
 */
export function GoogleTagScripts() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        id="google-tag-js"
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-tag"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
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
