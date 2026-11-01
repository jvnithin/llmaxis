/**
 * Google Apps Script for the home page "AI Job Assistance" form.
 *
 * Setup:
 * 1. Create a Google Sheet and open it.
 * 2. Extensions -> Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Copy the Web app URL into .env as JOB_ASSISTANCE_APPS_SCRIPT_URL.
 *    The script writes into the spreadsheet it is attached to.
 */

var JOB_ASSISTANCE_HEADERS = [
  "Timestamp (IST)",
  "Name",
  "Email",
  "Country",
  "Mobile Number",
  "Resume URL",
  "Visa",
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
    var sheet = jobAssistanceSheet(spreadsheet);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(JOB_ASSISTANCE_HEADERS);
      var header = sheet.getRange(1, 1, 1, JOB_ASSISTANCE_HEADERS.length);
      header.setFontWeight("bold");
      header.setBackground("#4F46E5");
      header.setFontColor("#FFFFFF");
      header.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      sheet.getRange("E:E").setNumberFormat("@");
      sheet.getRange("F:F").setWrap(true);
      sheet.setColumnWidth(6, 360);
    }

    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var phone = params.phone ? String(params.phone) : "";
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    sheet.appendRow([
      timestamp,
      params.name || "",
      params.email || "",
      params.country || "",
      phone,
      params.resumeUrl || params.resume || "",
      params.visa || "",
      params.source || "job_assistance"
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 5).setNumberFormat("@");

    return json({
      status: "success",
      message: "Job assistance request recorded successfully",
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

function jobAssistanceSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Job Assistance");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  if (active.getName() === "Sheet1") {
    active.setName("Job Assistance");
    return active;
  }

  return spreadsheet.insertSheet("Job Assistance");
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
