import { countries, getCountry } from "@/lib/countries";

export type ClientGeoResult = {
  countryCode: string;
  countryName: string;
  detectionMethod: "ipapi" | "locale" | "fallback";
};

/**
 * Browser-side country hint for static/export deploys where /api/* may be unavailable.
 * Prefer server detectCountryFromRequest when APIs work.
 */
export async function detectCountryClient(): Promise<ClientGeoResult> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json()) as {
        country_code?: string;
        country_name?: string;
        error?: boolean;
      };
      if (!data.error && data.country_code) {
        const code = data.country_code.toUpperCase();
        const match = countries.find((c) => c.code === code);
        return {
          countryCode: code,
          countryName: match?.name || data.country_name || code,
          detectionMethod: "ipapi",
        };
      }
    }
  } catch {
    // fall through
  }

  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "";
    const region = locale.split("-")[1]?.toUpperCase();
    if (region) {
      const match = countries.find((c) => c.code === region);
      if (match) {
        return {
          countryCode: match.code,
          countryName: match.name,
          detectionMethod: "locale",
        };
      }
    }
  } catch {
    // fall through
  }

  const fallbackCode = (
    process.env.NEXT_PUBLIC_EVENT_FALLBACK_COUNTRY ||
    process.env.EVENT_FALLBACK_COUNTRY ||
    "IN"
  ).toUpperCase();
  const match = getCountry(
    countries.find((c) => c.code === fallbackCode)?.name || "India",
  );
  return {
    countryCode: fallbackCode,
    countryName: match?.name || "India",
    detectionMethod: "fallback",
  };
}
