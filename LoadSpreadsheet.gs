_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"

/* Loads the spreadsheet */
function loadSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  return sheet;
}

function parseSpreadsheet() {
  // temporary hard-coding: opens first sheet of spreadsheet at _SHEET_URL
  sheet = SpreadsheetApp.openByUrl(_SHEET_URL).getSheets()[0];
  
  Logger.log(sheet.getDataRange().getValues()) // just for testing - shows that we are able to retrieve values
  
  // sheet.getDataRange() gets rectangle where data is present
  // sheet.getRange(row, column, numRows, numCols) gets rectangle starting at (row, column) w specified size
  
  // get range where data is present, starting at A1
  range = sheet.getDataRange();
  
  // store number of columns/rows in range
  let numCols = range.getLastColumn();
  let numRows = range.getLastRow();
  
  // 2D numRows*numCols array containing cells' formulas in R1C1 style
  // cells w/o formulas will be null
  let formulas = sheet.getFormulasR1C1();
  
  for (let i = numRows - 1; i >= 0; i--) {
    for (let i = numCols - 1; i >= 0; i--) {
      // find dependencies
      // check if equivalent to other formulas
    }
  }
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
