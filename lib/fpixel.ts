export const FB_PIXEL_ID = (
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  ""
).trim();

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

/**
 * Ensure `window.fbq` exists so events can be queued before fbevents.js loads
 */
const getFbq = (): ((...args: any[]) => void) | null => {
  if (typeof window === "undefined") return null;

  if (typeof window.fbq === "function") {
    return window.fbq;
  }

  // If fbq is not yet initialized on window, create the standard queue stub
  if (!window.fbq) {
    const queueStub: any = function (...args: any[]) {
      if (queueStub.callMethod) {
        queueStub.callMethod.apply(queueStub, args);
      } else {
        queueStub.queue.push(args);
      }
    };
    queueStub.push = queueStub;
    queueStub.loaded = true;
    queueStub.version = "2.0";
    queueStub.queue = [];
    window.fbq = queueStub;
    window._fbq = queueStub;
  }

  return window.fbq || null;
};

/**
 * Log standard PageView event to Meta Pixel
 */
export const pageview = () => {
  try {
    const fbq = getFbq();
    if (fbq) {
      fbq("track", "PageView");
    }
  } catch (err) {
    console.warn("[Meta Pixel] Failed to track PageView:", err);
  }
};

/**
 * Log standard events to Meta Pixel (e.g. Lead, Contact, InitiateCheckout, Purchase)
 * https://developers.facebook.com/docs/meta-pixel/reference
 */
export const event = (name: string, options: Record<string, any> = {}) => {
  try {
    const fbq = getFbq();
    if (fbq) {
      fbq("track", name, options);
    }
  } catch (err) {
    console.warn(`[Meta Pixel] Failed to track event '${name}':`, err);
  }
};

/**
 * Log custom events to Meta Pixel
 */
export const customEvent = (name: string, options: Record<string, any> = {}) => {
  try {
    const fbq = getFbq();
    if (fbq) {
      fbq("trackCustom", name, options);
    }
  } catch (err) {
    console.warn(`[Meta Pixel] Failed to track custom event '${name}':`, err);
  }
};
