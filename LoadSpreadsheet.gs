_SHEET_URL = "https://docs.google.com/spreadsheets/d/11VrFtmXizffwJOlF-X8VMX5WdCxMRRGI/"

/* Loads the spreadsheet */
function loadSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  return sheet;
}

function parseSpreadsheet() {
  // temporary hard-coding: opens first sheet of spreadsheet at _SHEET_URL
  sheet = SpreadsheetApp.openByUrl(_SHEET_URL).getSheets()[0];
  
  
}

/* Reads the variable in a cell */
function readCell() {
  spreadsheet = openById()
  Logger.log("readCell()");
  var currentCell = SpreadsheetApp.getCurrentCell();
  Logger.log(currentCell.getValue());
  return currentCell;
  //if (currentCell[length] == '=')
}
