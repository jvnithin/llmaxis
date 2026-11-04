import { countries, getCountry, type Country } from "@/lib/countries";

/** Currencies Razorpay commonly supports for international checkout. */
export const RAZORPAY_CURRENCIES = new Set([
  "INR",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "SGD",
  "AED",
  "MYR",
]);

/** ISO country → preferred checkout currency */
const COUNTRY_CURRENCY: Record<string, string> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IE: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  AE: "AED",
  SG: "SGD",
  MY: "MYR",
  NZ: "AUD",
};

const ZERO_DECIMAL = new Set(["JPY", "KRW"]);

/** India-only GST on taxable program fees (CGST+SGST / IGST total). */
export const INDIA_GST_RATE = 0.18;

export function baseEventPrice(): number {
  const price = Number(process.env.EVENT_PRICE ?? process.env.NEXT_PUBLIC_EVENT_PRICE);
  return Number.isFinite(price) && price > 0 ? price : 1;
}

export function baseEventCurrency(): string {
  const raw = (process.env.EVENT_CURRENCY || process.env.NEXT_PUBLIC_EVENT_CURRENCY || "INR")
    .trim()
    .toUpperCase();
  return raw || "INR";
}

export function fallbackCurrency(): string {
  const raw = (process.env.EVENT_FALLBACK_CURRENCY || "USD").trim().toUpperCase();
  return RAZORPAY_CURRENCIES.has(raw) ? raw : "USD";
}

export function currencyExponent(currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? 0 : 2;
}

export function currencyForCountryCode(countryCode: string | null | undefined): string {
  const code = (countryCode || "").toUpperCase();
  const mapped = COUNTRY_CURRENCY[code];
  if (mapped && RAZORPAY_CURRENCIES.has(mapped)) return mapped;
  return fallbackCurrency();
}

export function currencyForCountryName(countryName: string): string {
  const country = getCountry(countryName);
  return currencyForCountryCode(country?.code ?? null);
}

export function getCountryByCode(code: string): Country | null {
  const upper = code.toUpperCase();
  return countries.find((c) => c.code === upper) ?? null;
}

/** Parse EVENT_FX_RATES like "USD:0.012,GBP:0.0095,EUR:0.011" (units of that currency per 1 base unit). */
export function parseEnvFxRates(): Record<string, number> {
  const raw =
    process.env.EVENT_FX_RATES || process.env.NEXT_PUBLIC_EVENT_FX_RATES || "";
  const out: Record<string, number> = {};
  for (const part of raw.split(",")) {
    const [code, value] = part.split(":").map((s) => s.trim());
    if (!code || !value) continue;
    const rate = Number(value);
    if (Number.isFinite(rate) && rate > 0) out[code.toUpperCase()] = rate;
  }
  return out;
}

type FxCache = { at: number; base: string; rates: Record<string, number> };
let fxCache: FxCache | null = null;
const FX_TTL_MS = 60 * 60 * 1000;

async function fetchLiveRates(base: string): Promise<Record<string, number>> {
  const targets = [...RAZORPAY_CURRENCIES].filter((c) => c !== base).join(",");
  if (!targets) return {};
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(targets)}`;
  // `next.revalidate` is server-only; browser fallback uses a plain fetch.
  const res = await fetch(
    url,
    typeof window === "undefined" ? { next: { revalidate: 3600 } } : undefined,
  );
  if (!res.ok) throw new Error(`FX provider HTTP ${res.status}`);
  const data = (await res.json()) as { rates?: Record<string, number> };
  return data.rates || {};
}

export async function getFxRate(base: string, target: string): Promise<number> {
  const from = base.toUpperCase();
  const to = target.toUpperCase();
  if (from === to) return 1;

  const envRates = parseEnvFxRates();
  if (envRates[to]) return envRates[to];

  const now = Date.now();
  if (!fxCache || fxCache.base !== from || now - fxCache.at > FX_TTL_MS) {
    try {
      const rates = await fetchLiveRates(from);
      fxCache = { at: now, base: from, rates: { ...envRates, ...rates } };
    } catch (err) {
      console.error("FX fetch failed:", err);
      if (fxCache?.base === from) {
        // keep stale cache
      } else {
        fxCache = { at: now, base: from, rates: envRates };
      }
    }
  }

  const rate = fxCache?.rates[to];
  if (rate && rate > 0) return rate;

  throw new Error(`No FX rate available for ${from} → ${to}. Set EVENT_FX_RATES.`);
}

export function toMinorUnits(major: number, currency: string): number {
  const exp = currencyExponent(currency);
  const factor = 10 ** exp;
  return Math.round(major * factor);
}

export function fromMinorUnits(minor: number, currency: string): number {
  const exp = currencyExponent(currency);
  const factor = 10 ** exp;
  return minor / factor;
}

export function formatMoney(major: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: code === "AUD" || code === "CAD" ? "symbol" : "narrowSymbol",
      minimumFractionDigits: currencyExponent(code),
      maximumFractionDigits: currencyExponent(code),
    }).format(major);
  } catch {
    return `${code} ${major.toFixed(currencyExponent(code))}`;
  }
}

export type EventPriceQuote = {
  countryCode: string;
  countryName: string;
  currency: string;
  amountMajor: number;
  amountMinor: number;
  formattedPrice: string;
  baseCurrency: string;
  baseAmountMajor: number;
  fxRate: number;
  pricingSource: "base" | "fx_env" | "fx_live" | "fallback";
  /** Amount before India GST (same as amountMajor when GST does not apply). */
  taxableAmountMajor: number;
  gstRate: number;
  gstAmountMajor: number;
  includesGst: boolean;
};

export async function quoteEventPrice(input: {
  countryCode?: string | null;
  countryName?: string | null;
}): Promise<EventPriceQuote> {
  const baseCurrency = baseEventCurrency();
  const baseAmountMajor = baseEventPrice();

  let country =
    (input.countryCode && getCountryByCode(input.countryCode)) ||
    (input.countryName && getCountry(input.countryName)) ||
    null;

  if (!country && input.countryCode) {
    country = {
      name: input.countryCode.toUpperCase(),
      code: input.countryCode.toUpperCase(),
      dial: "",
    };
  }

  const countryCode = country?.code || "US";
  const countryName = country?.name || "International";
  let currency = currencyForCountryCode(countryCode);

  if (!RAZORPAY_CURRENCIES.has(currency)) {
    currency = fallbackCurrency();
  }

  if (currency === baseCurrency) {
    return finalizeQuote({
      countryCode,
      countryName,
      currency,
      taxableAmountMajor: baseAmountMajor,
      baseCurrency,
      baseAmountMajor,
      fxRate: 1,
      pricingSource: "base",
    });
  }

  const envRates = parseEnvFxRates();
  let pricingSource: EventPriceQuote["pricingSource"] = envRates[currency]
    ? "fx_env"
    : "fx_live";

  let fxRate: number;
  try {
    fxRate = await getFxRate(baseCurrency, currency);
  } catch {
    currency = fallbackCurrency();
    if (currency === baseCurrency) {
      return finalizeQuote({
        countryCode,
        countryName,
        currency,
        taxableAmountMajor: baseAmountMajor,
        baseCurrency,
        baseAmountMajor,
        fxRate: 1,
        pricingSource: "fallback",
      });
    }
    fxRate = await getFxRate(baseCurrency, currency);
    pricingSource = "fallback";
  }

  const taxableAmountMajor =
    Math.round(baseAmountMajor * fxRate * 10 ** currencyExponent(currency)) /
    10 ** currencyExponent(currency);

  return finalizeQuote({
    countryCode,
    countryName,
    currency,
    taxableAmountMajor,
    baseCurrency,
    baseAmountMajor,
    fxRate,
    pricingSource,
  });
}

function finalizeQuote(input: {
  countryCode: string;
  countryName: string;
  currency: string;
  taxableAmountMajor: number;
  baseCurrency: string;
  baseAmountMajor: number;
  fxRate: number;
  pricingSource: EventPriceQuote["pricingSource"];
}): EventPriceQuote {
  const appliesIndiaGst =
    input.countryCode.toUpperCase() === "IN" && input.currency.toUpperCase() === "INR";
  const gstRate = appliesIndiaGst ? INDIA_GST_RATE : 0;
  const exp = currencyExponent(input.currency);
  const factor = 10 ** exp;
  const gstAmountMajor = appliesIndiaGst
    ? Math.round(input.taxableAmountMajor * gstRate * factor) / factor
    : 0;
  const amountMajor = appliesIndiaGst
    ? Math.round((input.taxableAmountMajor + gstAmountMajor) * factor) / factor
    : input.taxableAmountMajor;

  return {
    countryCode: input.countryCode,
    countryName: input.countryName,
    currency: input.currency,
    amountMajor,
    amountMinor: toMinorUnits(amountMajor, input.currency),
    formattedPrice: formatMoney(amountMajor, input.currency),
    baseCurrency: input.baseCurrency,
    baseAmountMajor: input.baseAmountMajor,
    fxRate: input.fxRate,
    pricingSource: input.pricingSource,
    taxableAmountMajor: input.taxableAmountMajor,
    gstRate,
    gstAmountMajor,
    includesGst: appliesIndiaGst,
  };
}

/** @deprecated Prefer quoteEventPrice — kept for sheet helpers that need a quick format. */
export function eventPrice() {
  return baseEventPrice();
}

/** @deprecated Prefer quoteEventPrice */
export function eventCurrency() {
  return baseEventCurrency();
}

/** @deprecated Prefer formatMoney / quoteEventPrice */
export function formatEventPrice(price = baseEventPrice(), currency = baseEventCurrency()) {
  return formatMoney(price, currency);
}
