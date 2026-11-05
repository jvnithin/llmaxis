/**
 * Google Apps Script for the free career counselling form on guide pages
 * (works for both Articles and Roadmaps).
 *
 * Setup:
 * 1. Create a Google Sheet and open it.
 * 2. Extensions -> Apps Script.
 * 3. Replace everything in Code.gs with this file.
 * 4. Deploy -> New deployment -> Web app.
 * 5. Execute as: Me. Who has access: Anyone.
 * 6. Copy the Web app URL into .env as COUNSELLING_APPS_SCRIPT_URL.
 *    The script writes into the spreadsheet it is attached to.
 *
 * Expected query/body fields from /api/counselling:
 *   name, email, program, country, countryCode, phone,
 *   kind ("article" | "roadmap"), title, slug, source
 *   (legacy: article — treated as title)
 */

var COUNSELLING_HEADERS = [
  "Timestamp (IST)",
  "Full Name",
  "Email",
  "Program",
  "Country",
  "Country Code",
  "Mobile Number",
  "Content Type",
  "Title",
  "Slug",
  "Source",
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
    var sheet = counsellingSheet(spreadsheet);
    ensureCounsellingHeaders(sheet);

    var timestamp =
      params.timestamp ||
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    var phone = params.phone ? String(params.phone) : "";
    if (phone && phone.charAt(0) !== "'") phone = "'" + phone;

    var kind = normalizeKind(params.kind || params.contentType || params.content_type);
    var title = String(params.title || params.article || params.roadmap || "").trim();
    var slug = String(params.slug || "").trim();
    var source = String(params.source || "").trim();
    if (!source) {
      source =
        kind === "roadmap" ? "guide_roadmap_counselling" : "guide_article_counselling";
    }

    sheet.appendRow([
      timestamp,
      params.name || "",
      params.email || "",
      params.program || "",
      params.country || "",
      params.countryCode || "",
      phone,
      kind === "roadmap" ? "Roadmap" : "Article",
      title,
      slug,
      source,
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRow, 7).setNumberFormat("@");
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center");

    return json({
      status: "success",
      message: "Counselling request recorded successfully",
      kind: kind,
      row: lastRow,
    });
  } catch (error) {
    return json({
      status: "error",
      message: error.toString(),
    });
  } finally {
    lock.releaseLock();
  }
}

function normalizeKind(value) {
  var kind = String(value || "")
    .trim()
    .toLowerCase();
  if (kind === "roadmap" || kind === "roadmaps") return "roadmap";
  return "article";
}

function counsellingSheet(spreadsheet) {
  var named = spreadsheet.getSheetByName("Career Counselling");
  if (named) return named;

  var active = spreadsheet.getActiveSheet();
  if (active.getName() === "Sheet1") {
    active.setName("Career Counselling");
    return active;
  }

  return spreadsheet.insertSheet("Career Counselling");
}

/**
 * Creates or upgrades the header row so both Articles and Roadmaps share one sheet.
 * Older deployments used an "Article" column only — those sheets are migrated in place.
 */
function ensureCounsellingHeaders(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    writeHeaderRow(sheet);
    return;
  }

  var width = Math.max(sheet.getLastColumn(), COUNSELLING_HEADERS.length);
  var existing = sheet.getRange(1, 1, 1, width).getValues()[0];
  var normalized = existing.map(function (cell) {
    return String(cell || "")
      .trim()
      .toLowerCase();
  });

  var hasContentType = normalized.indexOf("content type") >= 0;
  var hasTitle = normalized.indexOf("title") >= 0;
  var hasSlug = normalized.indexOf("slug") >= 0;
  var hasArticleOnly =
    normalized.indexOf("article") >= 0 && !hasTitle && !hasContentType;

  if (hasContentType && hasTitle && hasSlug && normalized.length >= COUNSELLING_HEADERS.length) {
    // Already on the new schema.
    return;
  }

  if (hasArticleOnly) {
    // Migrate: Timestamp…Mobile, Article, Source  →  …Content Type, Title, Slug, Source
    var oldLastCol = Math.max(existing.length, 9);
    var dataRows = Math.max(sheet.getLastRow() - 1, 0);

    // Insert Content Type before Article (col 8), push Article→Title and Source right.
    sheet.insertColumnsBefore(8, 1); // new col 8 = Content Type, old Article becomes col 9
    if (dataRows > 0) {
      sheet.getRange(2, 8, dataRows, 1).setValue("Article");
    }

    // After Title (col 9), insert Slug (col 10); Source shifts to col 11.
    sheet.insertColumnsAfter(9, 1);
    if (dataRows > 0) {
      sheet.getRange(2, 10, dataRows, 1).setValue("");
    }

    writeHeaderRow(sheet);
    return;
  }

  // Unknown / partial header — rewrite header to the canonical shape.
  writeHeaderRow(sheet);
}

function writeHeaderRow(sheet) {
  sheet.getRange(1, 1, 1, COUNSELLING_HEADERS.length).setValues([COUNSELLING_HEADERS]);
  var header = sheet.getRange(1, 1, 1, COUNSELLING_HEADERS.length);
  header.setFontWeight("bold");
  header.setBackground("#4F46E5");
  header.setFontColor("#FFFFFF");
  header.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.getRange("G:G").setNumberFormat("@");
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 120);
  sheet.setColumnWidth(9, 280);
  sheet.setColumnWidth(10, 180);
  sheet.setColumnWidth(11, 200);
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
    ContentService.MimeType.JSON,
  );
}
