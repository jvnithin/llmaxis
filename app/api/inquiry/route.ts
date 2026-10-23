import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, inquiryType, interest, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required fields." },
        { status: 400 }
      );
    }

    const scriptUrl =
      process.env.INQUIRY_APPS_SCRIPT_URL ||
      process.env.NEXT_PUBLIC_INQUIRY_APPS_SCRIPT_URL ||
      process.env.GOOGLE_SHEET_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.warn(
        "No INQUIRY_APPS_SCRIPT_URL configured in environment variables."
      );
      // Still return 200 so UI continues gracefully in development
      return NextResponse.json({
        success: true,
        warning: "Sheet URL not configured",
      });
    }

    const params = new URLSearchParams({
      name: String(name).trim(),
      email: String(email).trim(),
      inquiryType: String(inquiryType || "Individuals").trim(),
      interest: String(interest || "General").trim(),
      message: String(message || "").trim(),
      source: "home_inquiry_form",
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      ...(process.env.INQUIRY_SPREADSHEET_ID
        ? { sheet_id: process.env.INQUIRY_SPREADSHEET_ID.trim() }
        : {}),
    });

    // Send to Google Apps Script
    const response = await fetch(`${scriptUrl}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(
        "Failed to send lead to Google Sheets:",
        response.status,
        response.statusText
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Inquiry API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
