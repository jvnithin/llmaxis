/**
 * Google Apps Script for LLM Axis Careers applications (/careers/[slug] Apply modal).
 *
 * Setup:
 * 1. Create a Google Sheet (or open an existing hiring sheet).
 * 2. Extensions → Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL into .env:
 *      NEXT_PUBLIC_CAREERS_APPS_SCRIPT_URL=...
 *    The script writes into the spreadsheet it is bound to (no sheet ID needed).
 *
 * Columns written:
 * Timestamp (IST), Full Name, Email, Country, Phone, Resume URL,
 * Social Links, Role, Source
 */

var CAREERS_HEADERS = [
  "Timestamp (IST)",
  "Full Name",
  "Email",
  "Country",
  "Phone",
  "Resume URL",
  "Social Links",
  "Role",
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
    var sheet = careersSheet(spreadsheet);

    ensureHeaders(sheet, CAREERS_HEADERS);

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
      "Resume URL": params.resume_url || params.resumeUrl || "",
      "Social Links":
        params.social_links || params.socialLinks || params.social_media || "",
      "Role": params.role || "",
      "Source": params.source || "careers_apply_form"
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    var phoneColumn = headerIndex(sheet, "Phone");
    if (phoneColumn > 0) {
      sheet.getRange(lastRow, phoneColumn).setNumberFormat("@");
    }

    return json({
      status: "success",
      message: "Career application recorded successfully",
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

function careersSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Careers Applications");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  var name = active.getName();
  if (
    name === "Sheet1" ||
    name === "Careers" ||
    name === "Applications" ||
    name === "Form Responses 1"
  ) {
    active.setName("Careers Applications");
    return active;
  }

  return spreadsheet.insertSheet("Careers Applications");
}

function ensureHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var created = sheet.getRange(1, 1, 1, headers.length);
    created.setFontWeight("bold");
    created.setBackground("#161269");
    created.setFontColor("#FFFFFF");
    created.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    var createdPhone = headerIndex(sheet, "Phone");
    if (createdPhone > 0) {
      sheet.getRange(1, createdPhone, sheet.getMaxRows(), 1).setNumberFormat("@");
      sheet.setColumnWidth(createdPhone, 180);
    }
    var resumeColumn = headerIndex(sheet, "Resume URL");
    if (resumeColumn > 0) {
      sheet.setColumnWidth(resumeColumn, 280);
    }
    var socialColumn = headerIndex(sheet, "Social Links");
    if (socialColumn > 0) {
      sheet.setColumnWidth(socialColumn, 320);
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
    cell.setBackground("#161269");
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
