/**
 * Google Apps Script for the LLM Axis Contact Us form (/contact).
 *
 * Setup:
 * 1. Open the Contact Us Google Sheet (or create a new one).
 * 2. Extensions → Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL into .env:
 *      CONTACT_APPS_SCRIPT_URL=...
 *      NEXT_PUBLIC_CONTACT_APPS_SCRIPT_URL=...
 *    The script writes into the spreadsheet it is bound to (no sheet ID needed).
 *
 * Columns written:
 * Timestamp (IST), Full Name, Email, Country, Phone, Message, Source
 *
 * Existing sheets keep their rows. Missing headers (e.g. Country) are appended.
 */

var CONTACT_HEADERS = [
  "Timestamp (IST)",
  "Full Name",
  "Email",
  "Country",
  "Phone",
  "Message",
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
    var sheet = contactSheet(spreadsheet);

    ensureHeaders(sheet, CONTACT_HEADERS);

    var timestamp =
      params.timestamp ||
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    var phone = params.phone ? String(params.phone).trim() : "";
    // Keep leading + as text so Sheets does not treat it as a formula.
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    appendByHeader(sheet, {
      "Timestamp (IST)": timestamp,
      "Full Name": params.name || "",
      "Email": params.email || "",
      "Country": params.country || "",
      "Phone": phone,
      "Message": params.message || "",
      "Source": params.source || "contact_us_form"
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    var phoneColumn = headerIndex(sheet, "Phone");
    if (phoneColumn > 0) {
      sheet.getRange(lastRow, phoneColumn).setNumberFormat("@");
    }

    return json({
      status: "success",
      message: "Contact request recorded successfully",
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

function contactSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Contact Us");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  var name = active.getName();
  if (name === "Sheet1" || name === "Contact" || name === "Form Responses 1") {
    active.setName("Contact Us");
    return active;
  }

  return spreadsheet.insertSheet("Contact Us");
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var created = sheet.getRange(1, 1, 1, headers.length);
    created.setFontWeight("bold");
    created.setBackground("#4F46E5");
    created.setFontColor("#FFFFFF");
    created.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    var createdPhone = headerIndex(sheet, "Phone");
    if (createdPhone > 0) {
      sheet.getRange(1, createdPhone, sheet.getMaxRows(), 1).setNumberFormat("@");
      sheet.setColumnWidth(createdPhone, 180);
    }
    return;
  }

  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  var lastFilled = 0;
  var missing = [];

  for (var i = 0; i < current.length; i++) {
    if (String(current[i] || "").trim()) lastFilled = i + 1;
  }
  for (var h = 0; h < headers.length; h++) {
    if (current.indexOf(headers[h]) === -1) missing.push(headers[h]);
  }
  if (!missing.length) return;

  for (var m = 0; m < missing.length; m++) {
    var cell = sheet.getRange(1, lastFilled + 1 + m);
    cell.setValue(missing[m]);
    cell.setFontWeight("bold");
    cell.setBackground("#4F46E5");
    cell.setFontColor("#FFFFFF");
    cell.setHorizontalAlignment("center");
  }

  var phoneColumn = headerIndex(sheet, "Phone");
  if (phoneColumn > 0) {
    sheet.getRange(1, phoneColumn, sheet.getMaxRows(), 1).setNumberFormat("@");
  }
}

function headerIndex(sheet, name) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  for (var i = 0; i < current.length; i++) {
    if (String(current[i]) === name) return i + 1;
  }
  return 0;
}

function appendByHeader(sheet, values) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  var row = [];
  for (var i = 0; i < current.length; i++) {
    var key = String(current[i] || "");
    row.push(
      key && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : ""
    );
  }
  sheet.appendRow(row);
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
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON
  );
}
