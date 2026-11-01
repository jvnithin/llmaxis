import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { eventCurrency, eventPrice, formatEventPrice } from "@/lib/eventPrice";
import { saveEventLeadToGoogleSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const { name, email, country, phone, event } = await req.json();

    if (!name || !email || !phone) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay API keys missing in environment variables");
      return Response.json(
        { success: false, error: "Payment gateway configuration missing" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const currency = eventCurrency();
    const price = eventPrice();
    const amountInSubunits = Math.round(price * 100);
    const priceFormatted = formatEventPrice(price, currency);
    const selectedEvent = event || "Beyond ChatGPT: How AI Is Learning to Think, Act & Work";

    // 1. Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: amountInSubunits,
      currency: currency,
      receipt: `event_${Date.now().toString().slice(-8)}`,
      notes: {
        name,
        email,
        phone,
        country: country || "India",
        event: selectedEvent,
      },
    });

    // 2. Save the initial form details to Google Sheet as Pending
    // This ensures details are stored even if payment is not completed
    await saveEventLeadToGoogleSheet({
      name,
      email,
      country: country || "India",
      phone,
      paymentStatus: "Pending",
      orderId: order.id,
      amount: priceFormatted,
      event: selectedEvent,
    });

    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
      priceFormatted: priceFormatted,
    });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to create payment order",
      },
      { status: 500 }
    );
  }
}
