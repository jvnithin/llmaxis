import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { appendInquiryRow } from "@/lib/inquirySheet";
import {
  resolvedPartnership,
  validatePartnershipInquiry,
  type PartnershipInquiry,
} from "@/lib/partnershipForm";

function partnershipScriptUrl(value: string | undefined) {
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
    const details: PartnershipInquiry = {
      fullName: String(body.fullName || ""),
      organization: String(body.organization || ""),
      email: String(body.email || ""),
      country: String(body.country || ""),
      phone: String(body.phone || ""),
      partnership: String(body.partnership || ""),
      customPartnership: String(body.customPartnership || ""),
      proposal: String(body.proposal || ""),
    };
    const errors = validatePartnershipInquiry(details);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields: errors }, { status: 400 });
    }

    const webhookUrl = partnershipScriptUrl(process.env["PARTNERSHIP_APPS_SCRIPT_URL"]);
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "Add the partnership Apps Script web app link in PARTNERSHIP_APPS_SCRIPT_URL.",
        },
        { status: 500 },
      );
    }

    const country = getCountry(details.country.trim());
    if (!country) {
      return NextResponse.json({ error: "Select your country." }, { status: 400 });
    }

    const saved = await appendInquiryRow(
      {
        name: details.fullName.trim().replace(/\s+/g, " "),
        organization: details.organization.trim().replace(/\s+/g, " "),
        email: details.email.trim(),
        country: country.name,
        phone: `'${country.dial} ${details.phone.trim()}`,
        partnership: resolvedPartnership(details),
        proposal: details.proposal.trim(),
        source: "partnership_inquiry",
      },
      { spreadsheetId: null, webhookUrl },
    );

    if (!saved.ok) {
      console.error("Partnership sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partnership API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
