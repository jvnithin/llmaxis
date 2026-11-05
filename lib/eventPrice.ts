import { countries, getCountry, type Country } from "@/lib/countries";

/**
 * Currencies we attempt at Razorpay checkout.
 * Unsupported ones fall back to USD after conversion for display+charge consistency.
 * @see https://razorpay.com/docs/payments/international-payments/
 */
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
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "HKD",
  "JPY",
  "NZD",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "ZAR",
  "THB",
  "PHP",
  "IDR",
  "BDT",
  "PKR",
  "LKR",
  "NPR",
  "EGP",
  "NGN",
  "KES",
  "GHS",
  "MXN",
  "BRL",
  "TRY",
  "PLN",
  "CZK",
  "HUF",
  "RON",
  "ILS",
  "CNY",
  "TWD",
  "KRW",
  "VND",
  // Local currencies for remaining countries in the enroll list
  // (must be on Razorpay's supported-currency table)
  "ALL",
  "DZD",
  "CLP",
  "COP",
  "ETB",
  "IQD",
  "JOD",
  "MAD",
  "MMK",
  "RUB",
  "TZS",
  "UGX",
  "UAH",
  "YER",
]);

/**
 * ISO country → checkout currency (one entry per country in lib/countries.ts).
 * Prefer the national currency when Razorpay supports it.
 * AF/AR/IR → USD: AFN, ARS, IRR are not on Razorpay's supported list.
 * ZW → USD: widely used for payments in Zimbabwe.
 * Only eurozone members use EUR.
 */
const COUNTRY_CURRENCY: Record<string, string> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  AE: "AED",
  SG: "SGD",
  DE: "EUR",
  AF: "USD", // AFN not supported by Razorpay
  AL: "ALL",
  DZ: "DZD",
  AR: "USD", // ARS not supported by Razorpay
  AT: "EUR",
  BD: "BDT",
  BE: "EUR",
  BR: "BRL",
  CL: "CLP",
  CN: "CNY",
  CO: "COP",
  DK: "DKK",
  EG: "EGP",
  ET: "ETB",
  FI: "EUR",
  FR: "EUR",
  GH: "GHS",
  GR: "EUR",
  HK: "HKD",
  HU: "HUF",
  ID: "IDR",
  IR: "USD", // IRR not supported by Razorpay
  IQ: "IQD",
  IE: "EUR",
  IL: "ILS",
  IT: "EUR",
  JP: "JPY",
  JO: "JOD",
  KE: "KES",
  KW: "KWD",
  MY: "MYR",
  MX: "MXN",
  MA: "MAD",
  MM: "MMK",
  NP: "NPR",
  NL: "EUR",
  NZ: "NZD",
  NG: "NGN",
  NO: "NOK",
  OM: "OMR",
  PK: "PKR",
  PH: "PHP",
  PL: "PLN",
  PT: "EUR",
  QA: "QAR",
  RO: "RON",
  RU: "RUB",
  SA: "SAR",
  ZA: "ZAR",
  KR: "KRW",
  ES: "EUR",
  LK: "LKR",
  SE: "SEK",
  CH: "CHF",
  TW: "TWD",
  TZ: "TZS",
  TH: "THB",
  TR: "TRY",
  UG: "UGX",
  UA: "UAH",
  VN: "VND",
  YE: "YER",
  ZW: "USD",
};

/**
 * Approximate units of target currency per 1 USD.
 * Used when live FX is unavailable (static export / blocked network).
 * Override anytime with NEXT_PUBLIC_EVENT_FX_RATES / EVENT_FX_RATES.
 */
const DEFAULT_FX_FROM_USD: Record<string, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.34,
  AED: 3.67,
  MYR: 4.47,
  SAR: 3.75,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.385,
  JOD: 0.709,
  HKD: 7.82,
  JPY: 149,
  NZD: 1.66,
  CHF: 0.88,
  SEK: 10.4,
  NOK: 10.6,
  DKK: 6.85,
  ZAR: 18.2,
  THB: 35.5,
  PHP: 56.5,
  IDR: 15800,
  BDT: 110,
  PKR: 278,
  LKR: 305,
  NPR: 133,
  EGP: 49,
  NGN: 1550,
  KES: 129,
  GHS: 15.5,
  MXN: 17.2,
  BRL: 5.05,
  TRY: 32.5,
  PLN: 3.95,
  CZK: 23.2,
  HUF: 360,
  RON: 4.57,
  ILS: 3.7,
  CNY: 7.25,
  TWD: 32.2,
  KRW: 1350,
  VND: 25400,
  ALL: 92,
  DZD: 134,
  CLP: 950,
  COP: 4000,
  ETB: 57,
  IQD: 1310,
  MAD: 10.1,
  MMK: 2100,
  RUB: 92,
  TZS: 2550,
  UGX: 3750,
  UAH: 41,
  YER: 250,
};

/**
 * Razorpay minor-unit exponents — must match
 * https://razorpay.com/docs/payments/international-payments/#supported-currencies
 */
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "UGX"]);

/** Dinars that use 3 decimal places (fils / fills). */
const THREE_DECIMAL = new Set(["KWD", "BHD", "OMR", "JOD", "IQD"]);

/** India-only GST on taxable program fees. */
export const INDIA_GST_RATE = 0.18;

export function baseEventPrice(): number {
  const price = Number(process.env.EVENT_PRICE ?? process.env.NEXT_PUBLIC_EVENT_PRICE);
  return Number.isFinite(price) && price > 0 ? price : 1;
}

export function baseEventCurrency(): string {
  const raw = (process.env.EVENT_CURRENCY || process.env.NEXT_PUBLIC_EVENT_CURRENCY || "USD")
    .trim()
    .toUpperCase();
  return raw || "USD";
}

export function fallbackCurrency(): string {
  const raw = (
    process.env.EVENT_FALLBACK_CURRENCY ||
    process.env.NEXT_PUBLIC_EVENT_FALLBACK_CURRENCY ||
    "USD"
  )
    .trim()
    .toUpperCase();
  return RAZORPAY_CURRENCIES.has(raw) ? raw : "USD";
}

export function currencyExponent(currency: string): number {
  const code = currency.toUpperCase();
  if (ZERO_DECIMAL.has(code)) return 0;
  if (THREE_DECIMAL.has(code)) return 3;
  return 2;
}

export function currencyForCountryCode(countryCode: string | null | undefined): string {
  const code = (countryCode || "").toUpperCase();
  return COUNTRY_CURRENCY[code] || fallbackCurrency();
}

export function currencyForCountryName(countryName: string): string {
  const country = getCountry(countryName);
  return currencyForCountryCode(country?.code ?? null);
}

export function getCountryByCode(code: string): Country | null {
  const upper = code.toUpperCase();
  return countries.find((c) => c.code === upper) ?? null;
}

/** Parse EVENT_FX_RATES like "INR:83.5,GBP:0.79" as units of that currency per 1 base unit. */
export function parseEnvFxRates(): Record<string, number> {
  const raw =
    process.env.NEXT_PUBLIC_EVENT_FX_RATES || "";
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
  const res = await fetch(
    url,
    typeof window === "undefined" ? { next: { revalidate: 3600 } } : undefined,
  );
  if (!res.ok) throw new Error(`FX provider HTTP ${res.status}`);
  const data = (await res.json()) as { rates?: Record<string, number> };
  return data.rates || {};
}

function bakedRateFromUsd(currency: string): number | null {
  const rate = DEFAULT_FX_FROM_USD[currency.toUpperCase()];
  return rate && rate > 0 ? rate : null;
}

/** Convert amount in `from` currency to `to` using USD as the bridge when needed. */
function convertViaBakedUsd(amount: number, from: string, to: string): number | null {
  const src = from.toUpperCase();
  const dst = to.toUpperCase();
  if (src === dst) return amount;

  const srcUsd = bakedRateFromUsd(src);
  const dstUsd = bakedRateFromUsd(dst);
  if (!srcUsd || !dstUsd) return null;

  // amount is in `from`; 1 USD = srcUsd units of from → amount/srcUsd USD → * dstUsd
  return (amount / srcUsd) * dstUsd;
}

export async function getFxRate(base: string, target: string): Promise<number> {
  const from = base.toUpperCase();
  const to = target.toUpperCase();
  if (from === to) return 1;

  const envRates = parseEnvFxRates();
  // Env rates are "per 1 base unit" when base matches EVENT_CURRENCY.
  if (envRates[to] && from === baseEventCurrency().toUpperCase()) {
    return envRates[to];
  }

  const now = Date.now();
  if (!fxCache || fxCache.base !== from || now - fxCache.at > FX_TTL_MS) {
    try {
      const rates = await fetchLiveRates(from);
      fxCache = { at: now, base: from, rates: { ...envRates, ...rates } };
    } catch (err) {
      console.error("FX fetch failed:", err);
      if (fxCache?.base !== from) {
        fxCache = { at: now, base: from, rates: { ...envRates } };
      }
    }
  }

  const live = fxCache?.rates[to];
  if (live && live > 0) return live;

  // Baked USD bridge (works offline / on static hosts).
  if (from === "USD") {
    const baked = bakedRateFromUsd(to);
    if (baked) return baked;
  }
  if (to === "USD") {
    const baked = bakedRateFromUsd(from);
    if (baked) return 1 / baked;
  }
  const bridged = convertViaBakedUsd(1, from, to);
  if (bridged && bridged > 0) return bridged;

  throw new Error(`No FX rate available for ${from} → ${to}. Set NEXT_PUBLIC_EVENT_FX_RATES.`);
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
  const exp = currencyExponent(code);
  try {
    // Prefer ISO code in the string so CAD/AUD/HKD/SGD/$ lookalikes are unambiguous.
    const formatted = new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      minimumFractionDigits: exp,
      maximumFractionDigits: exp,
    }).format(major);
    return formatted;
  } catch {
    return `${code} ${major.toFixed(exp)}`;
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
  pricingSource: "base" | "fx_env" | "fx_live" | "fx_baked" | "fallback";
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
  // Always quote in the country's real local currency (never silently swap to USD/EUR).
  const currency = currencyForCountryCode(countryCode);

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
    if (!envRates[currency] && pricingSource === "fx_live") {
      const usedBaked =
        !fxCache?.rates[currency] &&
        (baseCurrency.toUpperCase() === "USD"
          ? Boolean(bakedRateFromUsd(currency))
          : Boolean(convertViaBakedUsd(1, baseCurrency, currency)));
      if (usedBaked) pricingSource = "fx_baked";
    }
  } catch {
    // Keep local currency — convert via baked USD table instead of switching to dollars.
    const bridged = convertViaBakedUsd(baseAmountMajor, baseCurrency, currency);
    if (bridged && bridged > 0) {
      const exp = currencyExponent(currency);
      const taxable = Math.round(bridged * 10 ** exp) / 10 ** exp;
      return finalizeQuote({
        countryCode,
        countryName,
        currency,
        taxableAmountMajor: taxable,
        baseCurrency,
        baseAmountMajor,
        fxRate: taxable / baseAmountMajor,
        pricingSource: "fx_baked",
      });
    }
    throw new Error(
      `Unable to price ${currency} for ${countryName}. Add ${currency} to NEXT_PUBLIC_EVENT_FX_RATES.`,
    );
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

/** @deprecated Prefer quoteEventPrice */
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
