import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { validateCommunityDetails, type CommunityDetails } from "@/lib/communityForm";

function communityLink(value: string | undefined) {
  const raw = value?.trim() ?? "";
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const details: CommunityDetails = {
      name: String(body.name || ""),
      email: String(body.email || ""),
      country: String(body.country || ""),
      phone: String(body.phone || ""),
    };
    const errors = validateCommunityDetails(details);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields: errors }, { status: 400 });
    }

    const whatsapp = communityLink(process.env.COMMUNITY_WHATSAPP_URL);
    const discord = communityLink(process.env.COMMUNITY_DISCORD_URL);
    if (!whatsapp || !discord) {
      return NextResponse.json(
        { error: "Community links are not configured yet. Add them in the environment file." },
        { status: 500 }
      );
    }

    const country = getCountry(details.country.trim());
    const phone = `${country?.dial ?? ""} ${details.phone.trim()}`.trim();
    const scriptUrl =
      process.env.INQUIRY_APPS_SCRIPT_URL ||
      process.env.NEXT_PUBLIC_INQUIRY_APPS_SCRIPT_URL ||
      process.env.GOOGLE_SHEET_APPS_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("No inquiry sheet URL configured for community signups.");
      return NextResponse.json(
        { error: "The signup sheet is not configured yet. Please try again later." },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      name: details.name.trim().replace(/\s+/g, " "),
      email: details.email.trim(),
      inquiryType: "Individuals",
      interest: "AI Community",
      message: `Country: ${details.country.trim()}\nMobile: ${phone}`,
      phone: phone.startsWith("'") ? phone : `'${phone}`,
      country: details.country.trim(),
      source: "ai_community_form",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      ...(process.env.INQUIRY_SPREADSHEET_ID
        ? { sheet_id: process.env.INQUIRY_SPREADSHEET_ID.trim() }
        : {}),
    });

    const sheetResponse = await fetch(`${scriptUrl}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
    });
    const sheetBody = await sheetResponse.text();
    let recorded = sheetResponse.ok;
    try {
      const parsed = JSON.parse(sheetBody) as { status?: string };
      if (parsed.status === "error") recorded = false;
      if (parsed.status === "success") recorded = true;
    } catch {
      recorded = sheetResponse.ok;
    }
    if (!recorded) {
      console.error("Community form sheet request failed:", sheetResponse.status, sheetBody.slice(0, 300));
      return NextResponse.json(
        { error: "We could not save your details. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      links: { whatsapp, discord },
    });
  } catch (error) {
    console.error("Community form API error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
