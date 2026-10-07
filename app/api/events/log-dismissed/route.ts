import { NextResponse } from "next/server";
import { saveEventLeadToGoogleSheet } from "@/lib/googleSheets";

export async function POST(req: Request) {
  try {
    const { name, email, country, phone, orderId } = await req.json();

    if (name && email) {
      await saveEventLeadToGoogleSheet({
        name,
        email,
        country: country || "India",
        phone: phone || "N/A",
        paymentStatus: "Cancelled",
        orderId,
        amount: process.env.EVENT_CURRENCY === "USD" ? `$${process.env.EVENT_PRICE || 1}` : `₹${process.env.EVENT_PRICE || 499}`,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false });
  }
}
