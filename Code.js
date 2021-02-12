url = "https://script.google.com/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

// workaround to avoid "Sorry, unable to open the file at this time." when using 2 accounts - requires UCD auth
// https://sites.google.com/site/scriptsexamples/home/announcements/multiple-accounts-issue-with-google-apps-script
// url = "https://script.google.com/a/ucdavis.edu/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

N = 0

function test() {
  Logger.log("Test function called!");
  N += 1
  Logger.log("N=", N);
  return N;
}

/************** TRIGGERS ************
 * Functions that are triggered by
 *  on certain events related to the
 *  document or web app
************************************/

/* Called when user first opens document */
function onOpen(e) {
  buildMenu();
}

/* Called when user newly installs add-on while doc is already open */
function onInstall(e) {
  buildMenu();
}

/* Called when web app is loaded */
function doGet(e) {
  return buildHTML(true, e.parameter.ssid);
}
/***********************************/

/********* HTML INTERFACE *********/

function buildHTML(web = false, ssid, user) {
  let template = HtmlService.createTemplateFromFile('Interface');
  template.web = web;
  template.ssid = ssid;
  template.activeUser = Session.getActiveUser().getEmail();
  template.effectiveUser = Session.getEffectiveUser().getEmail();
  return template.evaluate();
}

function buildUrl(ssid) {
  email = Session.getActiveUser().getEmail().split("@");
  let urlNew = "";
  if (email.length == 2) {
    urlNew = url.replace("https://script.google.com/", "https://script.google.com/a/" + email[1] + "/");
  } else {
    Logger.log("Bad email '", email.join("@"), "'");
    urlNew = url;
  }
  urlNew = urlNew + "?ssid=" + ssid;
  Logger.log(urlNew);
  return urlNew;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/***********************************/

/***** MENU-RELATED FUNCTIONS *****/

/* Build menu */
function buildMenu() {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Open sidebar', 'openSidebar')
    .addToUi();
}

function openSidebar() {
  let html = buildHTML(false, SpreadsheetApp.getActiveSpreadsheet().getId());
  SpreadsheetApp.getUi().showSidebar(html);
}
/***********************************/

/***** SPREADSHEET API *****/
function getData(ssid) {
  return findRecurrence(SpreadsheetApp.openById(ssid).getSheets()[0]);
}

function testHighlight() {
  highlight("1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g", "G1:G5");
}

function highlight(ssid, rangeA1) {
  console.log("Made it w ssid", ssid, "range", rangeA1 + "!");
  sheet = SpreadsheetApp.openById(ssid).getSheets()[0];
  // sheet = SpreadsheetApp.getActiveSheet();
  range = sheet.getRange(rangeA1);
  range.setBackground('pink');
  return 0;
}

function unhighlight(ssid, rangeA1) {
  sheet = SpreadsheetApp.openById(ssid).getSheets()[0];
  // sheet = SpreadsheetApp.getActiveSheet();
  range = sheet.getRange(rangeA1);
  range.setBackground('white');
}
/***********************************/