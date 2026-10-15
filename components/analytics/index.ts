export { default as MetaPixel } from "./MetaPixel";
export { default as MetaPixelRouteTracker } from "./MetaPixelRouteTracker";
export * from "@/lib/fpixel";

export { default as GoogleAnalytics } from "./GoogleAnalytics";
export { default as GoogleAnalyticsRouteTracker } from "./GoogleAnalyticsRouteTracker";
export {
  GA_MEASUREMENT_ID,
  pageview as gaPageview,
  event as gaEvent,
} from "@/lib/gtag";
export type { GtagEventParams } from "@/lib/gtag";
