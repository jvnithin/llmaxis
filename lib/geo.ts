import { getCountryByCode } from "@/lib/eventPrice";

export type GeoResult = {
  countryCode: string;
  countryName: string;
  detectionMethod: "cloudflare" | "ipapi" | "fallback";
  clientIp: string | null;
};

type CacheEntry = { at: number; result: GeoResult };
const cache = new Map<string, CacheEntry>();
const GEO_TTL_MS = 30 * 60 * 1000;

function firstPublicIp(forwarded: string | null): string | null {
  if (!forwarded) return null;
  for (const part of forwarded.split(",")) {
    const ip = part.trim();
    if (!ip) continue;
    // Skip obvious private/local ranges; still imperfect without trusted-proxy config.
    if (
      ip.startsWith("10.") ||
      ip.startsWith("127.") ||
      ip.startsWith("192.168.") ||
      ip.startsWith("172.16.") ||
      ip === "::1"
    ) {
      continue;
    }
    return ip;
  }
  return forwarded.split(",")[0]?.trim() || null;
}

export function clientIpFromHeaders(headers: Headers): string | null {
  const cf = headers.get("cf-connecting-ip");
  if (cf?.trim()) return cf.trim();

  const realIp = headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  return firstPublicIp(headers.get("x-forwarded-for"));
}

async function lookupIpApi(ip: string): Promise<{ countryCode: string; countryName: string } | null> {
  try {
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      ...(typeof window === "undefined" ? { next: { revalidate: 1800 } } : {}),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      country_code?: string;
      country_name?: string;
      error?: boolean;
    };
    if (data.error || !data.country_code) return null;
    return {
      countryCode: data.country_code.toUpperCase(),
      countryName: data.country_name || data.country_code.toUpperCase(),
    };
  } catch {
    return null;
  }
}

export async function detectCountryFromRequest(headers: Headers): Promise<GeoResult> {
  const clientIp = clientIpFromHeaders(headers);
  const cacheKey = clientIp || "unknown";
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < GEO_TTL_MS) return cached.result;

  const cfCountry = headers.get("cf-ipcountry")?.trim().toUpperCase();
  if (cfCountry && cfCountry !== "XX" && cfCountry !== "T1") {
    const match = getCountryByCode(cfCountry);
    const result: GeoResult = {
      countryCode: cfCountry,
      countryName: match?.name || cfCountry,
      detectionMethod: "cloudflare",
      clientIp,
    };
    cache.set(cacheKey, { at: Date.now(), result });
    return result;
  }

  if (clientIp) {
    const lookedUp = await lookupIpApi(clientIp);
    if (lookedUp) {
      const match = getCountryByCode(lookedUp.countryCode);
      const result: GeoResult = {
        countryCode: lookedUp.countryCode,
        countryName: match?.name || lookedUp.countryName,
        detectionMethod: "ipapi",
        clientIp,
      };
      cache.set(cacheKey, { at: Date.now(), result });
      return result;
    }
  }

  const fallbackCode = (process.env.EVENT_FALLBACK_COUNTRY || "IN").toUpperCase();
  const match = getCountryByCode(fallbackCode);
  const result: GeoResult = {
    countryCode: fallbackCode,
    countryName: match?.name || "India",
    detectionMethod: "fallback",
    clientIp,
  };
  cache.set(cacheKey, { at: Date.now(), result });
  return result;
}
