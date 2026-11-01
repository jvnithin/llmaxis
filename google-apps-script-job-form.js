/**
 * Unused. The AI Job Assistance card now saves to a spreadsheet.
 * Use google-apps-script-job-assistance.js and JOB_ASSISTANCE_APPS_SCRIPT_URL.
 *
 * Creates the LLM Axis AI Job Assistance Google Form.
 *
 * Responses stay in the form's Responses tab. This script does not create a
 * spreadsheet and does not link the form to one.
 *
 * Do not paste this over the inquiry or business-card scripts.
 *
 * 1. Open https://script.google.com/home and create a project, or open the
 *    project you already started for this form.
 * 2. Replace all of Code.gs with this file. Save.
 * 3. Select createJobAssistanceForm and click Run. Approve the Forms permission.
 * 4. Copy the published form URL from the execution log. It looks like
 *    https://docs.google.com/forms/d/e/.../viewform
 * 5. Paste it into .env:
 *    JOB_ASSISTANCE_GOOGLE_FORM_URL=<published viewform URL>
 * 6. Save .env. The AI Job Assistance card opens this form.
 *
 * Close the blank "Untitled form". The script creates the real form.
 *
 * Paths:
 * - Page 1: Name, Email, Country.
 * - Next page: mobile number for the selected country. India is +91 and exactly
 *   10 digits starting with 6, 7, 8, or 9. Other countries use their own code
 *   and digit length. The respondent types the national number only.
 * - United States shows the +1 mobile field and the visa dropdown on that same page.
 * - Everyone then goes to the resume page. Other country pages are skipped.
 *
 * Google Forms cannot change a field on the same page, so the mobile question
 * is the next page after Country. Re-run this function to update the live form.
 * The public URL stays the same.
 */

var JOB_FORM_TITLE = "LLM Axis AI Job Assistance";
var USA_COUNTRY = "United States";
var VISA_STATUSES = ["OPT", "STEM-OPT", "H1B", "H4", "Green Card", "Citizen"];

/** Same names, dial codes, and lengths as lib/countries.ts. [name, dial, min digits, max digits] */
var JOB_FORM_COUNTRIES = [
  ["India", "+91", 10, 10],
  ["United States", "+1", 10, 10],
  ["United Kingdom", "+44", 10, 10],
  ["Canada", "+1", 10, 10],
  ["Australia", "+61", 9, 9],
  ["United Arab Emirates", "+971", 9, 9],
  ["Singapore", "+65", 8, 8],
  ["Germany", "+49", 10, 11],
  ["Afghanistan", "+93", 9, 9],
  ["Albania", "+355", 9, 9],
  ["Algeria", "+213", 9, 9],
  ["Argentina", "+54", 10, 10],
  ["Austria", "+43", 10, 13],
  ["Bangladesh", "+880", 10, 10],
  ["Belgium", "+32", 9, 9],
  ["Brazil", "+55", 10, 11],
  ["Chile", "+56", 9, 9],
  ["China", "+86", 11, 11],
  ["Colombia", "+57", 10, 10],
  ["Denmark", "+45", 8, 8],
  ["Egypt", "+20", 10, 10],
  ["Ethiopia", "+251", 9, 9],
  ["Finland", "+358", 9, 10],
  ["France", "+33", 9, 9],
  ["Ghana", "+233", 9, 9],
  ["Greece", "+30", 10, 10],
  ["Hong Kong", "+852", 8, 8],
  ["Hungary", "+36", 9, 9],
  ["Indonesia", "+62", 9, 12],
  ["Iran", "+98", 10, 10],
  ["Iraq", "+964", 10, 10],
  ["Ireland", "+353", 9, 9],
  ["Israel", "+972", 9, 9],
  ["Italy", "+39", 9, 10],
  ["Japan", "+81", 10, 10],
  ["Jordan", "+962", 9, 9],
  ["Kenya", "+254", 9, 9],
  ["Kuwait", "+965", 8, 8],
  ["Malaysia", "+60", 9, 10],
  ["Mexico", "+52", 10, 10],
  ["Morocco", "+212", 9, 9],
  ["Myanmar", "+95", 8, 10],
  ["Nepal", "+977", 10, 10],
  ["Netherlands", "+31", 9, 9],
  ["New Zealand", "+64", 8, 10],
  ["Nigeria", "+234", 10, 10],
  ["Norway", "+47", 8, 8],
  ["Oman", "+968", 8, 8],
  ["Pakistan", "+92", 10, 10],
  ["Philippines", "+63", 10, 10],
  ["Poland", "+48", 9, 9],
  ["Portugal", "+351", 9, 9],
  ["Qatar", "+974", 8, 8],
  ["Romania", "+40", 9, 9],
  ["Russia", "+7", 10, 10],
  ["Saudi Arabia", "+966", 9, 9],
  ["South Africa", "+27", 9, 9],
  ["South Korea", "+82", 9, 11],
  ["Spain", "+34", 9, 9],
  ["Sri Lanka", "+94", 9, 9],
  ["Sweden", "+46", 9, 10],
  ["Switzerland", "+41", 9, 9],
  ["Taiwan", "+886", 9, 9],
  ["Tanzania", "+255", 9, 9],
  ["Thailand", "+66", 9, 9],
  ["Turkey", "+90", 10, 10],
  ["Uganda", "+256", 9, 9],
  ["Ukraine", "+380", 9, 9],
  ["Vietnam", "+84", 9, 10],
  ["Yemen", "+967", 9, 9],
  ["Zimbabwe", "+263", 9, 9],
];

function createJobAssistanceForm() {
  if (!findCountry(USA_COUNTRY)) {
    throw new Error("Country list is missing United States, so the visa step cannot branch.");
  }

  var form = findJobAssistanceForm();
  if (!form) form = FormApp.create(JOB_FORM_TITLE);

  form.setTitle(JOB_FORM_TITLE);
  form.setDescription(
    "Choose your country, then enter the mobile number for that country. India uses +91 and 10 digits. United States also asks for visa status. Everyone uploads a PDF resume."
  );
  form.setConfirmationMessage("Thanks. We received your details.");
  applyFormSetting(form, "setAllowResponseEdits", false);
  applyFormSetting(form, "setLimitOneResponsePerUser", false);
  applyFormSetting(form, "setShowLinkToRespondAgain", false);
  applyFormSetting(form, "setProgressBar", false);
  applyFormSetting(form, "setAcceptingResponses", true);
  applyFormSetting(form, "setCollectEmail", false);
  publishForm(form);
  clearFormItems(form);

  var name = form.addTextItem();
  name.setTitle("Name");
  name.setRequired(true);

  var email = form.addTextItem();
  email.setTitle("Email");
  email.setRequired(true);
  email.setValidation(
    FormApp.createTextValidation()
      .requireTextIsEmail()
      .setHelpText("Enter a valid email address.")
      .build()
  );

  var country = form.addListItem();
  country.setTitle("Country");
  country.setRequired(true);
  country.setHelpText("United States also asks for your visa status on the next page.");

  var mobilePages = [];
  for (var index = 0; index < JOB_FORM_COUNTRIES.length; index++) {
    mobilePages.push(addMobilePage(form, JOB_FORM_COUNTRIES[index]));
  }

  var resumePage = form.addPageBreakItem();
  resumePage.setTitle("Resume");
  resumePage.setHelpText("Upload one PDF resume.");

  var resumeAdded = addPdfResume(form);

  // A page break controls the end of the page BEFORE it. The break after each
  // country page sends that country to the resume and skips the other countries.
  // The last country continues into the resume page.
  for (var pageIndex = 1; pageIndex < mobilePages.length; pageIndex++) {
    mobilePages[pageIndex].page.setGoToPage(resumePage);
  }

  var choices = [];
  for (var choiceIndex = 0; choiceIndex < mobilePages.length; choiceIndex++) {
    choices.push(country.createChoice(mobilePages[choiceIndex].name, mobilePages[choiceIndex].page));
  }
  country.setChoices(choices);

  var publishedUrl = form.getPublishedUrl();
  console.log("Published form URL (paste into JOB_ASSISTANCE_GOOGLE_FORM_URL):");
  console.log(publishedUrl);
  console.log("Edit form: " + form.getEditUrl());
  console.log("Responses stay in this form's Responses tab. Do not link a spreadsheet.");
  if (!resumeAdded) {
    console.log("Open the edit link and add the resume on the Resume section.");
    console.log("Add a question, change its type to File upload, allow only PDF, allow 1 file, and mark it Required.");
    console.log("If File upload is not in the question type list, this Google account cannot accept a PDF inside Google Forms.");
  }
  Logger.log(publishedUrl);
  return publishedUrl;
}

function addMobilePage(form, entry) {
  var countryName = entry[0];
  var dial = entry[1];
  var help = mobileHelp(entry);
  var page = form.addPageBreakItem();
  page.setTitle("Mobile Number (" + dial + ")");
  page.setHelpText(help);

  var field = form.addTextItem();
  field.setTitle("Mobile Number (" + dial + ")");
  field.setHelpText(help);
  field.setRequired(true);
  field.setValidation(
    FormApp.createTextValidation()
      .requireTextMatchesPattern(mobilePattern(entry))
      .setHelpText(mobileError(entry))
      .build()
  );

  if (countryName === USA_COUNTRY) {
    page.setTitle("United States");
    page.setHelpText("Enter your 10-digit mobile number, then select your visa status. Do not type +1.");
    var visa = form.addListItem();
    visa.setTitle("Visa status");
    visa.setHelpText("Select the option that applies to you.");
    visa.setRequired(true);
    visa.setChoiceValues(VISA_STATUSES);
  }

  return { name: countryName, page: page };
}

function mobileHelp(entry) {
  return "Country code " + entry[1] + ". Enter " + digitLabel(entry) + " only. Do not type " + entry[1] + ".";
}

function mobileError(entry) {
  if (entry[0] === "India") {
    return "Enter 10 digits starting with 6, 7, 8, or 9. Do not include +91.";
  }
  return "Enter " + digitLabel(entry) + ". Do not include " + entry[1] + ".";
}

function mobilePattern(entry) {
  if (entry[0] === "India") return "[6-9][0-9]{9}";
  if (entry[2] === entry[3]) return "[0-9]{" + entry[2] + "}";
  return "[0-9]{" + entry[2] + "," + entry[3] + "}";
}

function digitLabel(entry) {
  return entry[2] === entry[3] ? entry[2] + " digits" : entry[2] + " to " + entry[3] + " digits";
}

function findCountry(name) {
  for (var index = 0; index < JOB_FORM_COUNTRIES.length; index++) {
    if (JOB_FORM_COUNTRIES[index][0] === name) return JOB_FORM_COUNTRIES[index];
  }
  return null;
}

function addPdfResume(form) {
  if (typeof form.addFileUploadItem !== "function") {
    console.log("This Google account does not let Apps Script add a File upload question.");
    return false;
  }

  try {
    var resume = form.addFileUploadItem();
    resume.setTitle("Resume (PDF)");
    resume.setHelpText("Upload one PDF.");
    resume.setRequired(true);
    resume.setTypes([FormApp.FileUploadFileType.PDF]);
    try {
      resume.setMaximumFiles(1);
    } catch (error) {
      // Some accounts only expose the file count in the form editor.
    }
    try {
      resume.setMaxFileSize(10 * 1024 * 1024);
    } catch (error) {
      // Keep Google's default size limit when this method is unavailable.
    }
    return true;
  } catch (error) {
    console.log("File upload question was not added: " + error);
    return false;
  }
}

function clearFormItems(form) {
  releaseFormNavigation(form);
  deleteFormItems(form, false);
  deleteFormItems(form, true);
}

function releaseFormNavigation(form) {
  var items = form.getItems();
  for (var index = 0; index < items.length; index++) {
    var item = items[index];
    var type = item.getType();
    if (type === FormApp.ItemType.LIST) {
      setPlainChoices(item.asListItem());
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      setPlainChoices(item.asMultipleChoiceItem());
    } else if (type === FormApp.ItemType.CHECKBOX) {
      setPlainChoices(item.asCheckboxItem());
    } else if (type === FormApp.ItemType.PAGE_BREAK) {
      try {
        item.asPageBreakItem().setGoToPage(FormApp.PageNavigationType.CONTINUE);
      } catch (error) {
        // This section already continues to the next page.
      }
    }
  }
}

function setPlainChoices(item) {
  var choices = item.getChoices();
  var values = [];
  for (var index = 0; index < choices.length; index++) {
    values.push(choices[index].getValue());
  }
  if (values.length) item.setChoiceValues(values);
}

function deleteFormItems(form, pageBreaks) {
  var items = form.getItems();
  for (var index = items.length - 1; index >= 0; index--) {
    var item = items[index];
    var isBreak = item.getType() === FormApp.ItemType.PAGE_BREAK;
    if (isBreak !== pageBreaks) continue;
    form.deleteItem(item);
  }
}

function findJobAssistanceForm() {
  var queries = [
    'mimeType = "application/vnd.google-apps.form" and title = "' + JOB_FORM_TITLE + '" and trashed = false',
    'mimeType = "application/vnd.google-apps.form" and name = "' + JOB_FORM_TITLE + '" and trashed = false',
  ];

  for (var index = 0; index < queries.length; index++) {
    try {
      var files = DriveApp.searchFiles(queries[index]);
      if (files.hasNext()) return FormApp.openById(files.next().getId());
    } catch (error) {
      // Try the other Drive query. Newer accounts search by name, older ones by title.
    }
  }
  return null;
}

function applyFormSetting(form, methodName, value) {
  try {
    form[methodName](value);
  } catch (error) {
    // Keep building the form when an account does not expose this setting.
  }
}

function publishForm(form) {
  try {
    form.setPublished(true);
  } catch (error) {
    // Forms created by older Apps Script projects are already published.
  }
}
