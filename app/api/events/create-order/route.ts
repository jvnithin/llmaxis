import Razorpay from "razorpay";
import { quoteEventPrice } from "@/lib/eventPrice";
import { saveEventLeadToGoogleSheet } from "@/lib/googleSheets";
import { getCountry } from "@/lib/countries";

// Required when next.config has output: "export" (APIs usable in `next dev` only).
export const dynamic = "force-static";

export async function POST(req: Request) {
  try {
    const { name, email, country, phone, event, countryCode } = await req.json();

    if (!name || !email || !phone) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay API keys missing in environment variables");
      return Response.json(
        { success: false, error: "Payment gateway configuration missing" },
        { status: 500 },
      );
    }

    const resolvedCountry =
      (typeof countryCode === "string" && countryCode.trim()
        ? countryCode.trim().toUpperCase()
        : null) || getCountry(country || "")?.code || "IN";

    const quote = await quoteEventPrice({
      countryCode: resolvedCountry,
      countryName: country || undefined,
    });

    if (!quote.amountMinor || quote.amountMinor < 1) {
      return Response.json(
        { success: false, error: "Invalid computed payment amount" },
        { status: 400 },
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const selectedEvent =
      event || "Beyond ChatGPT: How AI Is Learning to Think, Act & Work";

    let order;
    try {
      order = await razorpay.orders.create({
        amount: quote.amountMinor,
        currency: quote.currency,
        receipt: `event_${Date.now().toString().slice(-8)}`,
        notes: {
          name,
          email,
          phone,
          country: country || quote.countryName,
          country_code: quote.countryCode,
          event: selectedEvent,
          base_currency: quote.baseCurrency,
          base_amount: String(quote.baseAmountMajor),
          fx_rate: String(quote.fxRate),
          pricing_source: quote.pricingSource,
          taxable_amount: String(quote.taxableAmountMajor),
          gst_rate: String(quote.gstRate),
          gst_amount: String(quote.gstAmountMajor),
          includes_gst: quote.includesGst ? "true" : "false",
        },
      });
    } catch (rzpError: unknown) {
      const message =
        rzpError instanceof Error ? rzpError.message : "Razorpay order creation failed";
      console.error("Razorpay order error:", rzpError);
      return Response.json(
        {
          success: false,
          error:
            /currency/i.test(message)
              ? `Currency ${quote.currency} is not enabled on this Razorpay account. Enable international payments / ${quote.currency} in the Razorpay dashboard, or set EVENT_FALLBACK_CURRENCY.`
              : message,
        },
        { status: 502 },
      );
    }

    await saveEventLeadToGoogleSheet({
      name,
      email,
      country: country || quote.countryName,
      phone,
      paymentStatus: "Pending",
      orderId: order.id,
      amount: quote.formattedPrice,
      event: selectedEvent,
    });

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      priceFormatted: quote.formattedPrice,
      amountMajor: quote.amountMajor,
      countryCode: quote.countryCode,
      pricingSource: quote.pricingSource,
      taxableAmountMajor: quote.taxableAmountMajor,
      gstRate: quote.gstRate,
      gstAmountMajor: quote.gstAmountMajor,
      includesGst: quote.includesGst,
    });
  } catch (error: unknown) {
    console.error("Error creating Razorpay order:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment order",
      },
      { status: 500 },
    );
  }
}
