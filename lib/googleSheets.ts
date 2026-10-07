const DEFAULT_APPS_SCRIPT_URL =
  process.env.GOOGLE_SHEET_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzi_lBi9iz_5rd2XM2FZnKIasIsoGoJmJT_6_LYGfyU7fkGalqiKkFlEvkSjQGXFCHldw/exec";

export interface EventLeadData {
  name: string;
  email: string;
  country: string;
  phone: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Cancelled";
  paymentId?: string;
  orderId?: string;
  amount?: number | string;
  event?: string;
}

export async function saveEventLeadToGoogleSheet(data: EventLeadData) {
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID ||
    "14p_q7p7iYU2ZtNaZCcr845-Mb13nOaW8AxqrpLjLKLE";

  const params = new URLSearchParams({
    source: "event_registration",
    sheet_id: spreadsheetId,
    event:
      data.event ||
      "Beyond ChatGPT: How AI Is Learning to Think, Act & Work",
    name: data.name,
    email: data.email,
    country: data.country,
    // Prepend single quote so Google Sheets treats it as string instead of a '+' formula
    phone: data.phone.startsWith("'") ? data.phone : `'${data.phone}`,
    payment_status: data.paymentStatus,
    payment_id: data.paymentId || "N/A",
    order_id: data.orderId || "N/A",
    amount: data.amount ? String(data.amount) : "$1",
    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  });

  try {
    const res = await fetch(`${DEFAULT_APPS_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      // Apps Script redirection
      redirect: "follow",
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging event lead to Google Sheet:", error);
    // Non-blocking fallback
    return { success: false, error };
  }
}
