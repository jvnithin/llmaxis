import { NextRequest, NextResponse } from "next/server";
import { appendInquiryRow } from "@/lib/inquirySheet";

function businessScriptUrl(value: string | undefined) {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const service = String(body.service || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !service) {
      return NextResponse.json(
        { error: "Name, email, and service are required." },
        { status: 400 }
      );
    }

    const webhookUrl = businessScriptUrl(process.env.BUSINESS_CARDS_APPS_SCRIPT_URL);
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "Add the business cards Apps Script web app link in BUSINESS_CARDS_APPS_SCRIPT_URL.",
        },
        { status: 500 },
      );
    }

    const phone = String(body.phone || "").trim();
    const saved = await appendInquiryRow({
      name,
      email,
      inquiryType: "Businesses",
      interest: service,
      message,
      phone: phone ? (phone.startsWith("'") ? phone : `'${phone}`) : "",
      country: String(body.country || "").trim(),
      company: String(body.company || "").trim(),
      role: String(body.role || "").trim(),
      enquiryType: String(body.enquiryType || "").trim(),
      source: "business_service_enquiry",
      sheet: "Business Enquiries",
    }, { spreadsheetId: null, webhookUrl });

    if (!saved.ok) {
      console.error("Business enquiry sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Business enquiry API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
