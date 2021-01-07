url = "https://script.google.com/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

// workaround to avoid "Sorry, unable to open the file at this time." when using 2 accounts - requires UCD auth
// https://sites.google.com/site/scriptsexamples/home/announcements/multiple-accounts-issue-with-google-apps-script
// url = "https://script.google.com/a/ucdavis.edu/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

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
  return buildHTML(true);
}
/***********************************/

/********* HTML INTERFACE *********/

function buildHTML(web = false) {
  let template = HtmlService.createTemplateFromFile('Interface');
  parseSheet();
  template.web = web;
  return template.evaluate();
}

function buildUrl() {
  email = Session.getActiveUser().getEmail().split("@");
  let urlNew = "";
  if (email.length == 2) {
    urlNew = url.replace("https://script.google.com/", "https://script.google.com/a/" + email[1] + "/");
  } else {
    Logger.log("Bad email '", email.join("@"), "'");
    urlNew = url;
  }
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
  let html = buildHTML(false);
  SpreadsheetApp.getUi().showSidebar(html);
}

function test() {
  Logger.log(ScriptApp.getService().getUrl());
}
/***********************************/