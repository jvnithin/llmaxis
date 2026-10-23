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

    // Determine target spreadsheet
    var sheet;
    if (params.sheet_id) {
      sheet = SpreadsheetApp.openById(params.sheet_id).getActiveSheet();
    } else {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Full Name",
        "Email",
        "Inquiry Type",
        "Interest Area",
        "Message",
        "Source"
      ]);

      // Style header row
      var headerRange = sheet.getRange("A1:G1");
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4F46E5");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Extract values with sensible fallbacks
    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = params.name || "N/A";
    var email = params.email || "N/A";
    var inquiryType = params.inquiryType || params.inquiry_type || "Individuals";
    var interest = params.interest || "General";
    var message = params.message || "";
    var source = params.source || "home_inquiry_form";

    // Append lead row
    sheet.appendRow([
      timestamp,
      name,
      email,
      inquiryType,
      interest,
      message,
      source
    ]);

    // Format latest row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");

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
