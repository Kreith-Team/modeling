// url = "https://script.google.com/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

// workaround to avoid "Sorry, unable to open the file at this time." when using 2 accounts - requires UCD auth
url = "https://script.google.com/a/ucdavis.edu/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

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
  template.web = web;
  return template.evaluate();
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