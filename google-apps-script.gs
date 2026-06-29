/**
 * WaterWise Enterprise — Lead Capture Web App
 * ---------------------------------------------------------------------------
 * Receives form submissions from the website (Contact form + Water Health Quiz)
 * and appends each one as a new row in the "Leads" sheet of this spreadsheet.
 *
 * DEPLOY (one time):
 *   1. In the spreadsheet, go to  Extensions → Apps Script.
 *   2. Delete any sample code, paste THIS whole file, and Save.
 *   3. Click  Deploy → New deployment.
 *   4. "Select type" (gear icon) →  Web app.
 *   5. Description: "WaterWise Leads".  Execute as: "Me".
 *      Who has access: "Anyone".   ← required so the website can post.
 *   6. Click Deploy, authorize when prompted, and COPY the Web app URL.
 *   7. Paste that URL into index.html where it says
 *      const LEAD_ENDPOINT = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
 *
 * If you ever change this code, run  Deploy → Manage deployments → Edit →
 * "New version" so the live URL picks up the change.
 * ---------------------------------------------------------------------------
 */

var SHEET_NAME = 'Leads';

// Owner-editable columns are appended AFTER these. The script only ever
// appends rows and writes the columns below — it never touches your notes.
var HEADERS = [
  'Timestamp', 'Source', 'Name', 'Phone', 'Email', 'Service', 'Message',
  'Quiz Score', 'Quiz Tier', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5',
  'Page', 'Referrer', 'Status', 'Qualified?', 'Notes', 'Followed Up On'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var answers = Array.isArray(data.answers) ? data.answers : [];

    var row = [
      new Date(),
      data.source || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.service || '',
      data.message || '',
      (data.quizScore === 0 || data.quizScore) ? data.quizScore : '',
      data.quizTier || '',
      answers[0] || '',
      answers[1] || '',
      answers[2] || '',
      answers[3] || '',
      answers[4] || '',
      data.page || '',
      data.referrer || '',
      'New',   // Status — starting value; edit freely in the sheet.
      '',      // Qualified? — owner fills in.
      '',      // Notes — owner fills in.
      ''       // Followed Up On — owner fills in.
    ];

    sheet.appendRow(row);
    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return json_({ result: 'ok', message: 'WaterWise lead endpoint is live.' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
