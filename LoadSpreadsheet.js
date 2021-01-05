_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"

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
  sheet = SpreadsheetApp.openByUrl(_FYS9).getSheets()[0];
  range = sheet.getDataRange();

  //finds the number of columns and rows in the range in spreadsheet (dimensions)
  let numCols = range.getLastColumn();
  let numRows = range.getLastRow();
  Logger.log("Dimensions of range", numRows, numCols);

  let formulasR1 = range.getFormulasR1C1();

  recNumCol = 0; //Number of recurrence formulas going down columns in the spreadsheet
  recListCol = [0]; //Array for the recurrence formulas going down columns
  recCol = [0]; //The array of columns where an recurrence relation occurs
  recStartRow = [0]; //The array of rows that the recurrence relation begins
  recEndRow = [0]; //The array of rows that the recurrence relation ends

  //Finds all recurrence formulas down a column and extracts their cell locations
  for(var j = 0; j <= numCols - 1; j++) {
    for(var i = 0; i <= numRows - 1; i++) {
      if(formulasR1[i][j][1] == 'R') { //If the formula starts with a '=' (R1C1 notation), then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i+1][j]) {
          recCol[recNumCol] = j;
          recStartRow[recNumCol] = i;
          recEndRow[recNumCol] = i; // so that recurrence end doesn't start @ 0
          recListCol[recNumCol] = formulasR1[i][j];
          //Logger.log(i, formulasR1[i][j], formulasR1[i+1][j]);
          while (i <= numRows - 2 && formulasR1[i][j] == formulasR1[i + 1][j]) {
            recEndRow[recNumCol]++;
            i++;
          }
          //Logger.log(recEnd);
          Logger.log("Recurrence relation", recListCol[recNumCol], 
            "at Column", recCol[recNumCol], "Rows", recStartRow[recNumCol], "to", recEndRow[recNumCol]);
          recNumCol++;
          break;
        }
      }
    }
  }

  recNumRow = 0; //Number of recurrence formulas going across rows in the spreadsheet
  recListRow = [0]; //Array for the recurrence formulas going across rows
  recRow = [0]; //The array of rows where an recurrence relation occurs
  recStartCol = [0]; //The array of columns that the recurrence relation begins
  recEndCol = [0]; //The array of columns that the recurrence relation ends

  //Finds all recurrence formulas across a row and extracts their cell locations
  for(var i = 0; i <= numRows - 1; i++) {
    for(var j = 0; j <= numCols - 1; j++) {
      if (formulasR1[i][j][0] == '=') { //If the formula starts with a '=' (R1C1 notation), then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i][j+1]) {
          recRow[recNumRow] = i;
          recStartCol[recNumRow] = j;
          recEndCol[recNumRow] = j; // so that recurrence end doesn't start @ 0
          recListRow[recNumRow] = formulasR1[i][j];
          //Logger.log(j, formulasR1[i][j], formulasR1[i][j+1]);
          while (j <= numCols - 2 && formulasR1[i][j] == formulasR1[i][j+1]) {
            recEndCol[recNumRow]++;
            j++;
          }
          Logger.log("Recurrence relation", recListRow[recNumRow], 
            "at Row", recRow[recNumRow], "Columns", recStartCol[recNumRow], "to", recEndCol[recNumRow]);
          recNumRow++;
          break;
        }
      }
    }
  }
  recList = [0]; //The longest recurrence list out of the two (recListCol & recListRow)
  if ((recEndRow[0] - recStartRow[0]) > (recEndCol[0] - recStartCol[0])) {
    recList = recListCol;
    recCoord = recCol;
    recStart = recStartRow;
    recEnd = recEndRow;
    for (var i = 0; i < recCoord.length; i++) {
      Logger.log("Main Recurrence relation", recList[i], "at Column", recCoord[i], "Rows", recStart[i], "to", recEnd[i]);
    }
  }
  else {
    recList = recListRow;
    recCoord = recRow;
    recStart = recStartCol;
    recEnd = recEndCol;
    for (var i = 0; i < recCoord.length; i++) {
      Logger.log("Main Recurrence relation", recList[i], "at Row", recCoord[i], "Columns", recStart[i], "to", recEnd[i]);
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
