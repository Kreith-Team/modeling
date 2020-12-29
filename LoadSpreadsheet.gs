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
  let formulasA1 = range.getFormula();
  let formulasR1 = range.getFormulasR1C1();
  
  for (let i = numRows - 1; i >= 0; i--) {
    for (let j = numCols - 1; i >= 0; i--) {
      // find dependencies
      // check if R1C1 formulas are equivalent
    }
  }
}

/* Reads the variable in a cell */
function readCell() {
  //opens the TEST SHEET spreadsheet (by ID)
  var spreadsheet = SpreadsheetApp.openById('1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g');
  var sheet = spreadsheet.getSheets()[0];
  var cellVariable = sheet.getCurrentCell().getValue();
  //Logger.log(cellVariable);
  
  //Gets the column and row numbers for the cell (this is hardcoded, line 46)
  var range = sheet.getRange("A1:A1");
  var col = range.getColumn();
  var row = range.getRow();
  Logger.log(col);
  Logger.log(row);

  //The length of the variable name in the cell (with the equals-sign if applicable)
  var varLength = cellVariable.length;
  //Logger.log(cellVariable[varLength-1]);
  var varValue;
  //If the variable name in the cell ends with an equal sign (=), then varValue is the value in the cell next to it
  if (cellVariable[varLength - 1] == '=')
  {
    varValue = sheet.getRange(row,col+1);
    Logger.log(varValue.getValue());
    return varValue.getValue();
  }

}
