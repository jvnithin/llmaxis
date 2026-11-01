/**
 * Google Apps Script for the LLM Axis "For Business" cards.
 *
 * Cards: AI Education & Corporate Training, AI Solutions, AI Consulting.
 *
 * Setup:
 * 1. Create a Google Sheet and open it.
 * 2. Extensions -> Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Copy the Web app URL into .env as BUSINESS_CARDS_APPS_SCRIPT_URL.
 *    The script writes into the spreadsheet it is attached to.
 */

var BUSINESS_HEADERS = [
  "Timestamp (IST)",
  "Full Name",
  "Email",
  "Phone",
  "Country",
  "Company",
  "Role",
  "Service",
  "Enquiry Type",
  "Details",
  "Source"
];

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var params = readParams(e);
    var spreadsheet = params.sheet_id
      ? SpreadsheetApp.openById(params.sheet_id)
      : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = businessSheet(spreadsheet);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(BUSINESS_HEADERS);
      var header = sheet.getRange(1, 1, 1, BUSINESS_HEADERS.length);
      header.setFontWeight("bold");
      header.setBackground("#4F46E5");
      header.setFontColor("#FFFFFF");
      header.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      sheet.getRange("D:D").setNumberFormat("@");
      sheet.getRange("J:J").setWrap(true);
      sheet.setColumnWidth(10, 420);
    }

    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var phone = params.phone ? String(params.phone) : "";
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    sheet.appendRow([
      timestamp,
      params.name || "",
      params.email || "",
      phone,
      params.country || "",
      params.company || "",
      params.role || "",
      params.interest || params.service || "",
      params.enquiryType || "",
      params.message || "",
      params.source || "business_service_enquiry"
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 4).setNumberFormat("@");

    return json({
      status: "success",
      message: "Business enquiry recorded successfully",
      row: lastRow
    });
  } catch (error) {
    return json({
      status: "error",
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function businessSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Business Enquiries");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  if (active.getName() === "Sheet1") {
    active.setName("Business Enquiries");
    return active;
  }

  return spreadsheet.insertSheet("Business Enquiries");
}

function readParams(e) {
  var params = {};
  if (e && e.parameter) {
    for (var key in e.parameter) params[key] = e.parameter[key];
  }
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      for (var bodyKey in body) params[bodyKey] = body[bodyKey];
    } catch (err) {}
  }
  return params;
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
