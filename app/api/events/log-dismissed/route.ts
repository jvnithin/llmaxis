import { NextResponse } from "next/server";
import { formatEventPrice } from "@/lib/eventPrice";
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
        amount: formatEventPrice(),
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false });
  }
}
