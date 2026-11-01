/**
 * Google Apps Script for LLM Axis Home Page Inquiry Form
 * 
 * Instructions to set up:
 * 1. Open Google Sheets (https://sheets.new) or your existing spreadsheet.
 * 2. Name your spreadsheet (e.g. "LLM Axis - Home Page Inquiries").
 * 3. Copy the Spreadsheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID_IS_HERE>/edit
 * 4. Paste that ID in your .env file:
 *    INQUIRY_SPREADSHEET_ID=<YOUR_SPREADSHEET_ID>
 * 5. In the Google Sheet, click "Extensions" -> "Apps Script".
 * 6. Replace everything in Code.gs with this entire file.
 * 7. Click "Deploy" (blue button at top right) -> "New deployment".
 * 8. Click the gear icon next to "Select type" and select "Web app".
 * 9. Configure deployment:
 *    - Description: "LLM Axis Inquiry Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial so your website can send leads)
 * 10. Click "Deploy" (authorize permissions if prompted).
 * 11. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 12. Paste it in your .env file:
 *     INQUIRY_APPS_SCRIPT_URL=<YOUR_WEB_APP_URL>
 *     NEXT_PUBLIC_INQUIRY_APPS_SCRIPT_URL=<YOUR_WEB_APP_URL>
 *
 * Home inquiry rows store:
 * Timestamp, Inquiry Type, Full Name, Email, Company, Country, Phone, Message, Interest, Source.
 * Individuals leave Company blank. Businesses fill Company and use a company email.
 * AI Community signups still use the Interest column.
 *
 * After pasting this file, deploy a new version with Who has access set to Anyone.
 * The For Business cards use google-apps-script-business.js. Do not paste that file here.
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent requests
  lock.tryLock(10000);

  try {
    var params = {};

    // 1. Parse URL query parameters if present
    if (e && e.parameter) {
      for (var key in e.parameter) {
        params[key] = e.parameter[key];
      }
    }

    // 2. Parse JSON body if sent via POST
    if (e && e.postData && e.postData.contents) {
      try {
        var jsonBody = JSON.parse(e.postData.contents);
        for (var bKey in jsonBody) {
          params[bKey] = jsonBody[bKey];
        }
      } catch (err) {
        // Fallback for form-encoded postData
      }
    }

    var spreadsheet = params.sheet_id
      ? SpreadsheetApp.openById(params.sheet_id)
      : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();
    var headers = [
      "Timestamp (IST)",
      "Inquiry Type",
      "Full Name",
      "Email",
      "Company",
      "Country",
      "Phone",
      "Message",
      "Interest",
      "Source"
    ];
    ensureHeaders(sheet, headers);

    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var phone = params.phone ? String(params.phone) : "";
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    appendByHeader(sheet, {
      "Timestamp (IST)": timestamp,
      "Inquiry Type": params.inquiryType || params.inquiry_type || "Individuals",
      "Full Name": params.name || "",
      "Email": params.email || "",
      "Company": params.company || "",
      "Country": params.country || "",
      "Phone": phone,
      "Message": params.message || "",
      "Interest": params.interest || "",
      "Interest Area": params.interest || "",
      "Source": params.source || "home_inquiry_form"
    });

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    var phoneColumn = headerIndex(sheet, "Phone");
    if (phoneColumn > 0) sheet.getRange(lastRow, phoneColumn).setNumberFormat("@");

    var result = {
      status: "success",
      message: "Inquiry recorded successfully",
      row: lastRow
    };

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    var errResult = {
      status: "error",
      message: error.toString()
    };

    return ContentService
      .createTextOutput(JSON.stringify(errResult))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
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
    if (createdPhone > 0) sheet.getRange(1, createdPhone, sheet.getMaxRows(), 1).setNumberFormat("@");
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
  if (phoneColumn > 0) sheet.getRange(1, phoneColumn, sheet.getMaxRows(), 1).setNumberFormat("@");
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
    row.push(key && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : "");
  }
  sheet.appendRow(row);
}
