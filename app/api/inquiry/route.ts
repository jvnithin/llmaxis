import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { appendInquiryRow } from "@/lib/inquirySheet";
import { isInquiryType, validateHomeInquiry, type HomeInquiry } from "@/lib/homeInquiry";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const inquiryType = String(body.inquiryType || "");
    const details: HomeInquiry = {
      inquiryType: isInquiryType(inquiryType) ? inquiryType : "Individuals",
      name: String(body.name || ""),
      email: String(body.email || ""),
      company: String(body.company || ""),
      country: String(body.country || ""),
      phone: String(body.phone || ""),
      message: String(body.message || ""),
    };
    if (!isInquiryType(inquiryType)) {
      return NextResponse.json(
        { error: "Choose Individuals or Businesses.", fields: { inquiryType: "Choose Individuals or Businesses." } },
        { status: 400 },
      );
    }

    const errors = validateHomeInquiry(details);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields: errors }, { status: 400 });
    }

    const country = getCountry(details.country.trim());
    const phone = `${country?.dial ?? ""} ${details.phone.trim()}`.trim();
    const saved = await appendInquiryRow({
      name: details.name.trim().replace(/\s+/g, " "),
      email: details.email.trim(),
      inquiryType: details.inquiryType,
      company: details.inquiryType === "Businesses" ? details.company.trim().replace(/\s+/g, " ") : "",
      country: details.country.trim(),
      phone: phone.startsWith("'") ? phone : `'${phone}`,
      message: details.message.trim(),
      source: "home_inquiry_form",
    });

    if (!saved.ok) {
      console.error("Home inquiry sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry API Error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
