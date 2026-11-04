import { NextResponse } from "next/server";
import { detectCountryFromRequest } from "@/lib/geo";
import { quoteEventPrice } from "@/lib/eventPrice";
import { getCountry } from "@/lib/countries";

// Required when next.config has output: "export" (APIs usable in `next dev` only).
export const dynamic = "force-static";

async function resolvePricing(input: {
  country?: string | null;
  countryCode?: string | null;
  headers: Headers;
}) {
  const detected = await detectCountryFromRequest(input.headers);
  const byName = input.country ? getCountry(input.country) : null;

  const countryCode =
    input.countryCode?.toUpperCase() || byName?.code || detected.countryCode;

  const quote = await quoteEventPrice({
    countryCode,
    countryName: byName?.name || detected.countryName,
  });

  return {
    success: true as const,
    detected: {
      countryCode: detected.countryCode,
      countryName: detected.countryName,
      detectionMethod: detected.detectionMethod,
    },
    country: {
      code: quote.countryCode,
      name: quote.countryName,
    },
    currency: quote.currency,
    amountMinor: quote.amountMinor,
    amountMajor: quote.amountMajor,
    formattedPrice: quote.formattedPrice,
    baseCurrency: quote.baseCurrency,
    baseAmountMajor: quote.baseAmountMajor,
    fxRate: quote.fxRate,
    pricingSource: quote.pricingSource,
    taxableAmountMajor: quote.taxableAmountMajor,
    gstRate: quote.gstRate,
    gstAmountMajor: quote.gstAmountMajor,
    includesGst: quote.includesGst,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const payload = await resolvePricing({
      country: searchParams.get("country"),
      countryCode: searchParams.get("countryCode"),
      headers: req.headers,
    });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Pricing country API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to resolve pricing",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      country?: string;
      countryCode?: string;
    };
    const payload = await resolvePricing({
      country: body.country,
      countryCode: body.countryCode,
      headers: req.headers,
    });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Pricing country API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to resolve pricing",
      },
      { status: 500 },
    );
  }
}
