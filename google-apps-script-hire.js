/**
 * Google Apps Script for the Hire Talent page.
 *
 * Setup:
 * 1. Create a Google Sheet and open it.
 * 2. Extensions -> Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Copy the Web app URL into .env as HIRE_APPS_SCRIPT_URL.
 *    The script writes into the spreadsheet it is attached to.
 */

var HIRE_HEADERS = [
  "Timestamp (IST)",
  "Name",
  "Company",
  "Email",
  "Country",
  "Country Code",
  "Mobile Number",
  "Hiring Interest",
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
    var sheet = hireSheet(spreadsheet);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HIRE_HEADERS);
      var header = sheet.getRange(1, 1, 1, HIRE_HEADERS.length);
      header.setFontWeight("bold");
      header.setBackground("#4F46E5");
      header.setFontColor("#FFFFFF");
      header.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      sheet.getRange("G:G").setNumberFormat("@");
      sheet.setColumnWidth(7, 180);
    }

    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var phone = params.phone ? String(params.phone) : "";
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    sheet.appendRow([
      timestamp,
      params.name || "",
      params.company || "",
      params.email || "",
      params.country || "",
      params.countryCode || "",
      phone,
      params.interest || "",
      params.source || "hire_talent"
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 7).setNumberFormat("@");

    return json({
      status: "success",
      message: "Hire request recorded successfully",
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

function hireSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Hire Talent");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  if (active.getName() === "Sheet1") {
    active.setName("Hire Talent");
    return active;
  }

  return spreadsheet.insertSheet("Hire Talent");
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
