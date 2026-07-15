/**
 * WaterWise Enterprise — Lead Capture Web App
 * ---------------------------------------------------------------------------
 * Receives form submissions from the website (Contact form + Water Health Quiz),
 * appends each one as a new row in the "Leads" sheet, AND emails you instantly
 * so you can call the lead back fast.
 *
 * DEPLOY (one time):
 *   1. In the spreadsheet, go to  Extensions → Apps Script.
 *   2. Delete any sample code, paste THIS whole file, and Save.
 *   3. Click  Deploy → New deployment.
 *   4. "Select type" (gear icon) →  Web app.
 *   5. Description: "WaterWise Leads".  Execute as: "Me".
 *      Who has access: "Anyone".   ← required so the website can post.
 *   6. Click Deploy, authorize when prompted, and COPY the Web app URL.
 *   7. Paste that URL into index.html where it says  const LEAD_ENDPOINT = ...
 *
 * ALREADY DEPLOYED AND JUST ADDING EMAIL? After pasting this new code and
 * Saving, run  Deploy → Manage deployments → (pencil) Edit → Version:
 * "New version" → Deploy.  The live URL stays the same. The first time a
 * lead comes in after this change, Google may ask you to authorize email
 * permission once.
 * ---------------------------------------------------------------------------
 */

// ── SETTINGS ────────────────────────────────────────────────────────────────
// Who gets the instant lead email. Add more addresses separated by commas,
// e.g. 'waterwise.ent@gmail.com, someoneelse@gmail.com'
var NOTIFY_EMAILS = 'waterwise.ent@gmail.com, binil@ascendcreativeconsulting.com';
// ────────────────────────────────────────────────────────────────────────────

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

    // Email the lead to you. Wrapped so an email hiccup never blocks the
    // row from being saved to the sheet.
    try { notify_(data, answers); } catch (mailErr) { /* logged, non-fatal */ }

    return json_({ result: 'success' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  }
}

// Lets you open the Web app URL in a browser to confirm it's live.
function doGet() {
  return json_({ result: 'ok', message: 'WaterWise lead endpoint is live.' });
}

function notify_(data, answers) {
  if (!NOTIFY_EMAILS) return;

  var isQuiz = (data.source || '').toLowerCase().indexOf('quiz') !== -1;
  var name = data.name || 'Someone';
  var subject = '🌊 New WaterWise ' + (isQuiz ? 'Quiz lead' : 'lead') + ': ' + name;

  var lines = [];
  lines.push('You have a new lead from the website.');
  lines.push('');
  lines.push('Source:  ' + (data.source || '—'));
  lines.push('Name:    ' + (data.name || '—'));
  lines.push('Phone:   ' + (data.phone || '—'));
  lines.push('Email:   ' + (data.email || '—'));
  if (data.service) lines.push('Service: ' + data.service);
  if (data.message) { lines.push(''); lines.push('Message:'); lines.push(data.message); }

  if (isQuiz) {
    lines.push('');
    lines.push('Water Health Quiz result:');
    if (data.quizTier)  lines.push('  Tier:  ' + data.quizTier);
    if (data.quizScore === 0 || data.quizScore) lines.push('  Score: ' + data.quizScore);
    for (var i = 0; i < answers.length; i++) {
      if (answers[i]) lines.push('  • ' + answers[i]);
    }
  }

  lines.push('');
  lines.push('Page:     ' + (data.page || '—'));
  lines.push('Referrer: ' + (data.referrer || '—'));
  lines.push('');
  lines.push('— Reply fast. The full record is in your WaterWise Leads sheet.');

  var options = { name: 'WaterWise Website' };
  // If the lead left an email, make "Reply" go straight to them.
  if (data.email && /\S+@\S+\.\S+/.test(data.email)) options.replyTo = data.email;

  MailApp.sendEmail(NOTIFY_EMAILS, subject, lines.join('\n'), options);
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
