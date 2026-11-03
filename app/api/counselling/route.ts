import { NextRequest, NextResponse } from "next/server";
import { validateEmail, validateName } from "@/lib/communityForm";
import { getCountry, validateMobile } from "@/lib/countries";
import { appendInquiryRow } from "@/lib/inquirySheet";

const PROGRAMS = [
  "Gen AI Foundation",
  "LLM Engineering",
  "RAG & Vector Databases",
  "AI Agent & Automation",
  "General AI Career Guidance",
];

function counsellingScriptUrl(value: string | undefined) {
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
    const name = String(body.name || "");
    const email = String(body.email || "");
    const countryName = String(body.country || "");
    const phone = String(body.phone || "");
    const program = String(body.program || "");
    const article = String(body.article || "").trim().slice(0, 180);

    const fields: Record<string, string> = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const country = getCountry(countryName.trim());
    const phoneError = validateMobile(countryName, phone);
    if (nameError) fields.name = nameError;
    if (emailError) fields.email = emailError;
    if (!country) fields.country = "Select your country.";
    if (phoneError) {
      fields.phone = phoneError === "Enter your phone or WhatsApp number." ? "Enter your mobile number." : phoneError;
    }
    if (!PROGRAMS.includes(program)) fields.program = "Choose a program.";
    if (Object.keys(fields).length > 0) {
      return NextResponse.json({ error: "Check the highlighted fields.", fields }, { status: 400 });
    }

    const webhookUrl = counsellingScriptUrl(process.env.COUNSELLING_APPS_SCRIPT_URL);
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Add the counselling Apps Script web app link in COUNSELLING_APPS_SCRIPT_URL." },
        { status: 500 },
      );
    }

    const saved = await appendInquiryRow(
      {
        name: name.trim().replace(/\s+/g, " "),
        email: email.trim(),
        program,
        country: country!.name,
        countryCode: country!.dial,
        phone: `'${country!.dial} ${phone.trim()}`,
        article,
        source: "guide_counselling",
      },
      { spreadsheetId: null, webhookUrl },
    );

    if (!saved.ok) {
      console.error("Counselling sheet request failed:", saved.error);
      return NextResponse.json({ error: saved.error }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Counselling API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
