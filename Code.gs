url = "https://script.google.com/macros/s/AKfycbwpGhQZ4_Gu7aHSog4J1ppJfMIj_Pb-JU-sqaqEMOXx3DqgoNA/exec"

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
  return buildHTML();
}
/***********************************/

/********* HTML INTERFACE *********/

function buildHTML() {
  let template = HtmlService.createTemplateFromFile('Interface');
  return template.evaluate();
  // return HtmlService.createHtmlOutputFromFile('Interface');
}

/***********************************/

/***** MENU-RELATED FUNCTIONS *****/

/* Build menu */
function buildMenu() {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Open sidebar', 'openSidebar')
    .addItem('Open in new window', 'openWindow')
    .addToUi();
}

function openSidebar() {
  let html = buildHTML();
  SpreadsheetApp.getUi().showSidebar(html);
}

function openWindow() {
  window.open(url);
}
/***********************************/