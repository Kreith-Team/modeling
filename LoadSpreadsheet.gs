_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"

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
  Logger.log("Dimensions of range", numCols, numRows);
  
  // 2D numRows*numCols array containing cells' formulas in R1C1 style
  // cells w/o formulas will be null
  let formulasA1 = range.getFormula();
  let formulasR1 = range.getFormulasR1C1();
  Logger.log(formulasR1);
  
  var recurrenceNum = 0;
  var recurrenceList = [0];

  for (let i = numRows - 1; i >= 0; i--) {
    for (let j = numCols - 1; j >= 0; j--) {
      // find dependencies, check if R1C1 formulas are equivalent
      if(formulasR1[i][j][1] == 'R'){
        //If the formula begins with an R (in R1C1 notation), then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i-1][j]) {
          //Do something if there is a recurrence relation
          recurrenceList[recurrenceNum] = formulasR1[i][j];
          recurrenceNum = recurrenceNum + 1;
        }  
      }
    }
  }
}

function findRecurrence() {
  sheet = SpreadsheetApp.openByUrl(_FYS3).getSheets()[0];
  range = sheet.getDataRange();

  //finds the number of columns and rows in the range in spreadsheet (dimensions)
  let numCols = range.getLastColumn();
  let numRows = range.getLastRow();
  Logger.log("Dimensions of range", numRows, numCols);

  let formulasR1 = range.getFormulasR1C1();

  recurrenceNum = 0; //Number of recurrence formulas in the spreadsheet
  recurrenceList = [0]; //Array for the recurrence formulas
  recCol = [0]; //The array of columns where an recurrence relation occurs
  recStart = [0, 0, 0, 0, 0, 0, 0, 0]; //The array of rows that the recurrence relation begins
  recEnd = [0, 0, 0, 0, 0, 0, 0, 0]; //The array of rows that the recurrence relation ends

  //for loop finds all recurrence formulas in spreadsheet and puts them in a list
  for(var j = 0; j <= numCols - 1; j++) {
    for(var i = 0; i <= numRows - 1; i++) {
      if (formulasR1[i][j][1] == 'R') {
        //If the formula begins with an R (in R1C1 notation), then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i+1][j]) {
          recCol[recurrenceNum] = j;
          recStart[recurrenceNum] = i;
          recEnd[recurrenceNum] = i; // so that recurrence end doesn't start @ 0
          recurrenceList[recurrenceNum] = formulasR1[i][j];
          Logger.log(i, formulasR1[i][j], formulasR1[i+1][j]);
          while (i <= numRows - 2 && formulasR1[i][j] == formulasR1[i + 1][j]) {
            recEnd[recurrenceNum]++;
            i++;
          }
          Logger.log(recEnd);
          Logger.log("Recurrence relation", recurrenceList[recurrenceNum], 
            "at Column", recCol[recurrenceNum], "Rows", recStart[recurrenceNum], "to", recEnd[recurrenceNum]);
          recurrenceNum++;
          break;
        }
      }
    }
  }
  for(var i = 0; i <= recurrenceList.length; i++) {
    
  }
  //Logger.log(recurrenceList); //logs the recurrence formulas
}

/* Reads the variable in a cell */
function readCell() {
  //opens the TEST SHEET spreadsheet (by ID)
  var spreadsheet = SpreadsheetApp.openById('1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g');
  var sheet = spreadsheet.getSheets()[0];
  var cellVariable = sheet.getCurrentCell().getValue();
  //Logger.log(cellVariable);
  
  //Gets the column and row numbers for the cell
  var range = sheet.getDataRange();
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
