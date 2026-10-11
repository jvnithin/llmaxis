import crypto from "crypto";
import { FB_PIXEL_ID } from "./fpixel";

interface MetaServerEventPayload {
  eventName: "PageView" | "Lead" | "InitiateCheckout" | "Purchase" | "Contact" | string;
  email?: string;
  phone?: string;
  name?: string;
  value?: number;
  currency?: string;
  orderId?: string;
  sourceUrl?: string;
  customData?: Record<string, any>;
}

const hashSha256 = (value: string): string => {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
};

/**
 * Send server-side event to Meta Conversions API (CAPI)
 * Automatically no-ops safely if META_ACCESS_TOKEN is not configured.
 */
export async function sendMetaServerEvent(payload: MetaServerEventPayload) {
  const accessToken =
    process.env.META_ACCESS_TOKEN ||
    process.env.FACEBOOK_CONVERSIONS_API_TOKEN;

  if (!accessToken || !FB_PIXEL_ID) {
    // Graceful skip if Meta Conversions API token is not yet configured
    return { success: true, skipped: true };
  }

  try {
    const userData: Record<string, any> = {};

    if (payload.email) {
      userData.em = [hashSha256(payload.email)];
    }

    if (payload.phone) {
      // Clean phone number (strip non-digits)
      const cleanPhone = payload.phone.replace(/[^0-9]/g, "");
      if (cleanPhone) {
        userData.ph = [hashSha256(cleanPhone)];
      }
    }

    if (payload.name) {
      const parts = payload.name.trim().split(/\s+/);
      if (parts[0]) userData.fn = [hashSha256(parts[0])];
      if (parts.length > 1) userData.ln = [hashSha256(parts[parts.length - 1])];
    }

    const eventData = {
      event_name: payload.eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: payload.sourceUrl || "https://llmaxis.in",
      user_data: userData,
      custom_data: {
        currency: payload.currency || "USD",
        value: payload.value ?? 1,
        ...(payload.orderId ? { order_id: payload.orderId } : {}),
        ...(payload.customData || {}),
      },
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventData],
        }),
      }
    );

    const json = await res.json();
    return { success: res.ok, data: json };
  } catch (error) {
    console.warn("[Meta Conversions API] Server event error:", error);
    return { success: false, error };
  }
}
