import crypto from "crypto";
import { quoteEventPrice, formatEventPrice } from "@/lib/eventPrice";
import { saveEventLeadToGoogleSheet } from "@/lib/googleSheets";
import { sendMetaServerEvent } from "@/lib/metaConversions";

// Required when next.config has output: "export" (APIs usable in `next dev` only).
export const dynamic = "force-static";

function signaturesMatch(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  try {
    const {
      orderId,
      paymentId,
      signature,
      name,
      email,
      country,
      phone,
      amount,
      event,
      countryCode,
    } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return Response.json(
        { success: false, error: "Missing payment verification parameters" },
        { status: 400 },
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return Response.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 },
      );
    }

    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");
    const isAuthentic = signaturesMatch(generatedSignature, String(signature));
    const selectedEvent =
      event || "Beyond ChatGPT: How AI Is Learning to Think, Act & Work";

    let quoteAmount = typeof amount === "string" && amount ? amount : "";
    try {
      const quote = await quoteEventPrice({
        countryCode: countryCode || undefined,
        countryName: country || undefined,
      });
      if (!quoteAmount) quoteAmount = quote.formattedPrice;
    } catch {
      if (!quoteAmount) quoteAmount = formatEventPrice();
    }

    if (!isAuthentic) {
      console.error("Razorpay signature verification failed");
      await saveEventLeadToGoogleSheet({
        name: name || "Unknown",
        email: email || "Unknown",
        country: country || "India",
        phone: phone || "Unknown",
        paymentStatus: "Failed",
        orderId,
        paymentId,
        amount: quoteAmount,
        event: selectedEvent,
      });

      return Response.json(
        { success: false, error: "Payment signature verification failed" },
        { status: 400 },
      );
    }

    await saveEventLeadToGoogleSheet({
      name: name || "Customer",
      email: email || "N/A",
      country: country || "India",
      phone: phone || "N/A",
      paymentStatus: "Paid",
      paymentId,
      orderId,
      amount: quoteAmount,
      event: selectedEvent,
    });

    const quote = await quoteEventPrice({
      countryCode: countryCode || undefined,
      countryName: country || undefined,
    }).catch(() => null);

    sendMetaServerEvent({
      eventName: "Purchase",
      email,
      phone,
      name,
      orderId,
      value: quote?.amountMajor ?? (Number(process.env.EVENT_PRICE) || 1),
      currency: quote?.currency ?? process.env.EVENT_CURRENCY ?? "USD",
    }).catch(() => {});

    return Response.json({
      success: true,
      message: "Payment successfully verified and logged",
      paymentId,
    });
  } catch (error: unknown) {
    console.error("Error verifying Razorpay payment:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment verification error",
      },
      { status: 500 },
    );
  }
}
