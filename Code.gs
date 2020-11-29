function buildHTML() {
  return HtmlService
    .createTemplateFromFile('Interface')
    .evaluate();
  // return HtmlService.createHtmlOutputFromFile('Interface');
}

/* Menu Options */
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createAddonMenu()
    .addItem('Open sidebar', 'openSidebar')
    .addToUi();
  /* if (e && e.authMode == ScriptApp.AuthMode.NONE) { // not authorized: can't check properties
    menu.addItem('Open sidebar', 'serveSidebar');
  }
  else { // authorized
    var properties = PropertiesService.getDocumentProperties();
    var sidebarOpen = properties.getProperty('sidebar');
    menu.addItem('Open sidebar', 'serveSidebar');
    // change menu display based on whether sidebar is open
  } */
  // https://developers.google.com/gsuite/add-ons/concepts/menus
}

function doGet() {
  return buildHTML();
}

function openSidebar() {
  let html = buildHTML();
  SpreadsheetApp.getUi().showSidebar(html);
}

function readSpreadsheet() {
}