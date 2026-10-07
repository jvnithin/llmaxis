import { NextResponse } from "next/server";
import crypto from "crypto";
import { saveEventLeadToGoogleSheet } from "@/lib/googleSheets";

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
    } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return Response.json(
        { success: false, error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return Response.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 }
      );
    }

    // Verify Razorpay HMAC signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest("hex");

    const isAuthentic = generatedSignature === signature;

    if (!isAuthentic) {
      console.error("Razorpay signature verification failed");
      // Log failure in Google Sheet
      await saveEventLeadToGoogleSheet({
        name: name || "Unknown",
        email: email || "Unknown",
        country: country || "India",
        phone: phone || "Unknown",
        paymentStatus: "Failed",
        orderId,
        paymentId,
        amount,
      });

      return Response.json(
        { success: false, error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // Payment Verified Successfully -> Store Paid Details in Google Sheet
    await saveEventLeadToGoogleSheet({
      name: name || "Customer",
      email: email || "N/A",
      country: country || "India",
      phone: phone || "N/A",
      paymentStatus: "Paid",
      paymentId,
      orderId,
      amount: amount || `₹${process.env.EVENT_PRICE_INR || 499}`,
    });

    return Response.json({
      success: true,
      message: "Payment successfully verified and logged",
      paymentId,
    });
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    return Response.json(
      { success: false, error: error.message || "Payment verification error" },
      { status: 500 }
    );
  }
}
