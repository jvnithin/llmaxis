type InquiryFields = Record<string, string>;

type SheetResult =
  | { ok: true; row?: number }
  | { ok: false; error: string };

function scriptUrl() {
  return (
    process.env.INQUIRY_APPS_SCRIPT_URL ||
    process.env.NEXT_PUBLIC_INQUIRY_APPS_SCRIPT_URL ||
    process.env.GOOGLE_SHEET_APPS_SCRIPT_URL ||
    ""
  ).trim();
}

export async function appendInquiryRow(
  fields: InquiryFields,
  options?: { spreadsheetId?: string | null; webhookUrl?: string },
): Promise<SheetResult> {
  const url = (options?.webhookUrl || scriptUrl()).trim();
  if (!url) {
    return { ok: false, error: "The inquiry spreadsheet is not configured." };
  }

  const spreadsheetId =
    options?.spreadsheetId === null
      ? ""
      : (options?.spreadsheetId ?? process.env.INQUIRY_SPREADSHEET_ID ?? "").trim();

  const params = new URLSearchParams({
    ...fields,
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ...(spreadsheetId ? { sheet_id: spreadsheetId } : {}),
  });

  const response = await fetch(`${url}?${params.toString()}`, {
    method: "GET",
    redirect: "follow",
  });
  const text = await response.text();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  let parsed: { status?: string; result?: string; message?: string; row?: number } = {};
  if (start >= 0 && end > start) {
    try {
      parsed = JSON.parse(text.slice(start, end + 1));
    } catch {
      parsed = {};
    }
  }

  const status = parsed.status || parsed.result;
  if (response.status === 403) {
    return {
      ok: false,
      error:
        "The Apps Script web app denied access. Redeploy it and set Who has access to Anyone.",
    };
  }
  if (!response.ok || status !== "success") {
    if (parsed.message) console.error("Inquiry sheet error:", parsed.message);
    return { ok: false, error: "The enquiry could not be saved to the spreadsheet." };
  }

  return { ok: true, row: parsed.row };
}
