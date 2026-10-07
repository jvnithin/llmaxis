/**
 * Google Apps Script Code for LLM Axis Event Registration & Razorpay Integration
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/14p_q7p7iYU2ZtNaZCcr845-Mb13nOaW8AxqrpLjLKLE/edit
 * 2. Click on "Extensions" -> "Apps Script"
 * 3. Delete existing code and paste this entire file
 * 4. Click "Deploy" -> "Manage deployments" -> Edit (pencil icon) -> Version: "New version" -> Deploy
 *    (Or if deploying for the first time: "Deploy" -> "New deployment" -> Select "Web app" -> Execute as "Me", Access "Anyone")
 * 5. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 6. Paste that URL into .env as GOOGLE_SHEET_APPS_SCRIPT_URL=<YOUR_WEB_APP_URL>
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

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Country",
        "Phone Number",
        "Event Name",
        "Payment Status",
        "Payment ID",
        "Order ID",
        "Amount"
      ]);
      sheet.getRange("A1:J1").setFontWeight("bold").setBackground("#F3F4F6");
      // Format entire Phone column (E) as plain text
      sheet.getRange("E:E").setNumberFormat("@");
    }

    var params = e && e.parameter ? e.parameter : {};
    
    // Parse JSON body if sent as POST body
    if (e && e.postData && e.postData.contents) {
      try {
        var jsonBody = JSON.parse(e.postData.contents);
        for (var key in jsonBody) {
          params[key] = jsonBody[key];
        }
      } catch (err) {}
    }

    var timestamp = params.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var name = params.name || "";
    var email = params.email || "";
    var country = params.country || "India";
    var phone = params.phone ? String(params.phone).trim() : "";
    
    // Force plain text so Google Sheets doesn't evaluate leading '+' as a formula (#ERROR!)
    if (phone && !phone.startsWith("'")) {
      phone = "'" + phone;
    }

    var eventName = params.event || "Beyond ChatGPT: How AI Is Learning to Think, Act & Work";
    var paymentStatus = params.payment_status || "Pending";
    var paymentId = params.payment_id || "N/A";
    var orderId = params.order_id || "N/A";
    var amount = params.amount || "$1";

    // If row already exists for this orderId (pending to paid update), update it
    var data = sheet.getDataRange().getValues();
    var rowIndexToUpdate = -1;

    if (orderId && orderId !== "N/A") {
      for (var i = 1; i < data.length; i++) {
        // Check orderId match (column I is index 8)
        if (data[i][8] == orderId) {
          rowIndexToUpdate = i + 1;
          break;
        }
      }
    }

    if (rowIndexToUpdate > 0 && paymentStatus === "Paid") {
      // Update existing pending row to Paid
      sheet.getRange(rowIndexToUpdate, 7).setValue("Paid");
      sheet.getRange(rowIndexToUpdate, 8).setValue(paymentId);
      sheet.getRange(rowIndexToUpdate, 1).setValue(timestamp);
      if (amount && amount !== "N/A") {
        sheet.getRange(rowIndexToUpdate, 10).setValue(amount);
      }
    } else {
      // Format the new phone cell explicitly as text before inserting
      var nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 5).setNumberFormat("@");
      
      // Append new row
      sheet.appendRow([
        timestamp,
        name,
        email,
        country,
        phone,
        eventName,
        paymentStatus,
        paymentId,
        orderId,
        amount
      ]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", status: paymentStatus })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
