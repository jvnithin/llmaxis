import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { appendInquiryRow } from "@/lib/inquirySheet";
import {
  resolvedHireInterest,
  validateHireForm,
  type HireForm,
} from "@/lib/hireForm";

function hireScriptUrl(value: string | undefined) {
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
    const details: HireForm = {
      name: String(body.name || ""),
      company: String(body.company || ""),
      email: String(body.email || ""),
      country: String(body.country || ""),
      phone: String(body.phone || ""),
      interest: String(body.interest || ""),
      customInterest: String(body.customInterest || ""),
    };
    const errors = validateHireForm(details);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields: errors }, { status: 400 });
    }

    const webhookUrl = hireScriptUrl(process.env["HIRE_APPS_SCRIPT_URL"]);
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Add the hire Apps Script web app link in HIRE_APPS_SCRIPT_URL." },
        { status: 500 },
      );
    }

    const country = getCountry(details.country.trim());
    if (!country) {
      return NextResponse.json({ error: "Select a country code." }, { status: 400 });
    }

    const saved = await appendInquiryRow(
      {
        name: details.name.trim().replace(/\s+/g, " "),
        company: details.company.trim().replace(/\s+/g, " "),
        email: details.email.trim(),
        country: country.name,
        countryCode: country.dial,
        phone: `'${country.dial} ${details.phone.trim()}`,
        interest: resolvedHireInterest(details),
        source: "hire_talent",
      },
      { spreadsheetId: null, webhookUrl },
    );

    if (!saved.ok) {
      console.error("Hire sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hire API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
