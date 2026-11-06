/** Primary Google tag ID (gtag.js). Prefer the Google tag / GTM container ID. */
export const GA_MEASUREMENT_ID = (
  process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ||
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  "GTM-M3N8RFRG"
).trim();

export type GtagEventParams = Record<
  string,
  string | number | boolean | null | undefined | Array<unknown> | Record<string, unknown>
>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (
      command: "js" | "config" | "event" | "set" | "consent",
      targetIdOrDate: string | Date,
      configOrParams?: GtagEventParams
    ) => void;
  }
}

/**
 * Log pageviews to Google Analytics / Google tag
 */
export const pageview = (url: string): void => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  } catch (err) {
    console.warn("[Google Analytics] Failed to track pageview:", err);
  }
};

/**
 * Log custom or standard events to Google Analytics
 * Example: event('conversion', { send_to: '...' }) or event('button_click', { label: 'Register' })
 */
export const event = (
  action: string,
  params: GtagEventParams = {}
): void => {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", action, params);
    }
  } catch (err) {
    console.warn(`[Google Analytics] Failed to track event '${action}':`, err);
  }
};
