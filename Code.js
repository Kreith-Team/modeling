url = "https://script.google.com/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

// workaround to avoid "Sorry, unable to open the file at this time." when using 2 accounts - requires UCD auth
// https://sites.google.com/site/scriptsexamples/home/announcements/multiple-accounts-issue-with-google-apps-script
// url = "https://script.google.com/a/ucdavis.edu/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

function test() {
  Logger.log("Test function called!");
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

function buildHTML(web = false, ssid) {
  let template = HtmlService.createTemplateFromFile('Interface');
  template.web = web;
  template.ssid = ssid;
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