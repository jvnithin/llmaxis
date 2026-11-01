import { NextRequest, NextResponse } from "next/server";
import { getCountry } from "@/lib/countries";
import { appendInquiryRow } from "@/lib/inquirySheet";
import {
  isUnitedStates,
  validateJobAssistanceInquiry,
  type JobAssistanceInquiry,
} from "@/lib/jobAssistanceInquiry";

function jobAssistanceScriptUrl(value: string | undefined) {
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
    const details: JobAssistanceInquiry = {
      name: String(body.name || ""),
      email: String(body.email || ""),
      country: String(body.country || ""),
      phone: String(body.phone || ""),
      resumeUrl: String(body.resumeUrl || ""),
      visa: String(body.visa || ""),
    };
    const errors = validateJobAssistanceInquiry(details);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields: errors }, { status: 400 });
    }

    const webhookUrl = jobAssistanceScriptUrl(process.env["JOB_ASSISTANCE_APPS_SCRIPT_URL"]);
    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "Add the job assistance Apps Script web app link in JOB_ASSISTANCE_APPS_SCRIPT_URL.",
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
        name: details.name.trim().replace(/\s+/g, " "),
        email: details.email.trim(),
        country: country.name,
        phone: `'${country.dial} ${details.phone.trim()}`,
        resumeUrl: details.resumeUrl.trim(),
        visa: isUnitedStates(country.name) ? details.visa.trim() : "",
        source: "job_assistance",
      },
      { spreadsheetId: null, webhookUrl },
    );

    if (!saved.ok) {
      console.error("Job assistance sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job assistance API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
