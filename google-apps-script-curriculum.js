/**
 * Google Apps Script for LLM Axis Download Curriculum / Brochure Form
 * 
 * Instructions to link your new Google Spreadsheet:
 * 1. Open Google Sheets (https://sheets.new) or your target spreadsheet.
 * 2. Name your spreadsheet (e.g. "LLM Axis - Curriculum Downloads").
 * 3. In the Google Sheet, click "Extensions" -> "Apps Script".
 * 4. Delete any existing code in Code.gs and paste this entire file.
 * 5. Click "Deploy" (blue button at top right) -> "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Configure deployment:
 *    - Description: "Curriculum Download Form"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (Required so anyone downloading curriculum can submit)
 * 8. Click "Deploy" and authorize permissions if prompted.
 * 9. Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 10. Send the URL here or paste it into .env as NEXT_PUBLIC_BROCHURE_APPS_SCRIPT_URL=<YOUR_WEB_APP_URL>
 */

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
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Country",
        "Phone Number",
        "Source"
      ]);
      sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#F3F4F6");
      sheet.getRange("E:E").setNumberFormat("@"); // Format phone as plain text
    }

    var params = {};

    // 1. Read query parameters (GET)
    if (e && e.parameter) {
      for (var key in e.parameter) {
        params[key] = e.parameter[key];
      }
    }

    // 2. Read JSON body if POST
    if (e && e.postData && e.postData.contents) {
      try {
        var jsonBody = JSON.parse(e.postData.contents);
        for (var bKey in jsonBody) {
          params[bKey] = jsonBody[bKey];
        }
      } catch (err) {}
    }

    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = params.name || "N/A";
    var email = params.email || "N/A";
    var country = params.country || "India";
    var phone = params.phone || "N/A";
    var source = params.source || "brochure_download";

    // Append lead to spreadsheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      country,
      phone,
      source
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Curriculum lead captured successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
