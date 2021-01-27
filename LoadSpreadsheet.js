_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"

function getFromUrl(urlSpreadsheet) {
  return findRecurrence(SpreadsheetApp.openByUrl(urlSpreadsheet).getSheets()[0]);
}

/* Reads spreadsheet with given SSID number */
function readSheet(ssid) {
  // Arbitrary function to generate IDs - will be more useful when we need
  // to allow users to make edits to relations that don't affect them overall

  const sheet = SpreadsheetApp.openByUrl(urlSpreadsheet).getSheets()[0];
  let relations = findRecurrence(sheet);
}

/* Takes in outout from findRecurrence(); parses */
function parseRelations(relationsFound) {
  n = 0;
  const generateID = () => {
    n += 1;
    return (strn - 1).toString();
  }

  constant2id = {}
  relations = []
  constants = []

  for (let rel of relationsFound) {
    const formulaR1C1 = rel.formula;
  }
}

function findNames() {
  //if it is a column range (like A1:A10)
  //  find the name above or below the range
  //if it is a row range (like A1:J10)
  //  find the name to the right or left of the range
  range = SpreadsheetApp.openByUrl(_FYS4).getRange("B6:B18");
  // https://developers.google.com/apps-script/reference/spreadsheet/range#offset(Integer,Integer,Integer)
  
  name = "";

  return name;
}

function convertFunctions2() {
  let rels = getFromUrl(_FYS6);

  const overColumns = (rels[0].range.getColumn() == rels[0].range.getLastColumn());

  for (let i = 0; i < rels.length; i++) {
    let formula = rels[i].formula.substring(1, rels[i].formula.length);
    let range = rels[i].range;
    Logger.log("====Formula" + (i + 1) + " " + formula + "====");
    Logger.log("Range from rows %d to %d and cols %d to %d", 
      range.getRow(), range.getLastRow(), range.getColumn(), range.getLastColumn());

    //Separates operations and the parsed R1C1 cells into respective arrays
    let operation = []; //Array of operations (+, -, *, /, (, ), etc) in the formula
    let operationIndex = 0; //Index of the operation array
    let parsed = []; //Array of parsed cells in the formula (R1C1)
    let parsedIndex = 0; //Index of the parsed cells array
    let startIndex = 0; //Start index substring
    for (let j = 0; j < formula.length; j++) {
      if (formula[j] == "+" || formula[j] == "*" || formula[j] == "/" || formula[j] == "(" || formula[j] == ")" || 
          formula[j] == "^" || formula[j] == "," || formula[j] == ":" || (formula[j] == "-" && formula[j-1] != "[")) {
        operation[operationIndex] = formula[j];
        operationIndex++;
        parsed[parsedIndex] = formula.substring(startIndex, j);
        parsedIndex++;
        startIndex = j + 1;
      }
      if (j == formula.length - 1) {
        parsed[parsedIndex] = formula.substring(startIndex);
      }
    }
    Logger.log("Parsed array of R1C1 parts " + parsed);
    for (let k = 0; k < parsed.length; k++) {
      if(/\d/.test(parsed[k]) == false) { //If it is a function like SUM(), MIN(), ROUND(); does not account for functions with numbers like LOG10()
        parsed[k] = parsed[k];
      }
      else if(checkFixedCell(parsed[k]) == true && isNaN(parsed[k])) { //if it is a fixed cell (R1C1, not R[1]C[1]) and not a scalar (number)
        var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
        var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
        colnum = parseInt(colnum);
        parsed[k] = overColummns ? 
          String.fromCharCode(colnum + 64) + rownum :
          String.fromCharCode(colnum + 64) + String.fromCharCode(range.getRow() + 48);
      }
      else if(!isNaN(parsed[k]) && parsed[k] != 0) { //if it is a scalar (number) not equal to 0
        parsed[k] = parseFloat(parsed[k]);
      }
      else if(parsed[k] == 0) {
        parsed[k] = '0';
      }
      else if(parsed[k] == null) { //if there is nothing there
        parsed[k] = null;
      }
      else { //if it is a not a fixed cell, nor a scalar, nor null (R[1]C[1] or R[1]C1 (fixed column) or R1C[1] (fixed row))
        if (isFixedColumn(parsed[k])) {
          var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
          var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
          colnum = parseInt(colnum);
          parsed[k] = overColumns ?
            String.fromCharCode(colnum + 64) + "(n+" + rowTranslate + ")" :
            "(Col+" + colTranslate + ")" + rownum;
        }
        else if (isFixedRow(parsed[k])) {
          var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
          var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
          var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
          parsed[k] = column + rownum;
        }
        else {
          var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
          var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
          var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
          parsed[k] = column + "(n+" + rowTranslate + ")";
        }
      }
    }
    Logger.log(parsed);
    Logger.log(operation);
    //Concatenate the converted parses back into formula
    formula = "";
    for (let k = 0; k < parsed.length - 1; k++) {
      if(parsed[k] == null) {
        formula = formula + operation[k];
      }
      else {
        formula = formula + parsed[k] + operation[k];
      }
    }
    if(parsed[parsed.length - 1] != null) {
      formula = formula + parsed[parsed.length - 1];
    }
    Logger.log(formula);
  }
}

/* adapted from convertFunctions - parsing portion */
function parseFormula(formula) {
  formula = formula.substring(1, formula.length);
  //let range = rel.range;

  //Separates operations and the parsed R1C1 cells into respective arrays
  let operation = []; //Array of operations (+, -, *, /, (, ), etc) in the formula
  let operationIndex = 0; //Index of the operation array
  let parsed = []; //Array of parsed cells in the formula (R1C1)
  let parsedIndex = 0; //Index of the parsed cells array
  let startIndex = 0; //Start index substring

  for (let j = 1; j < formula.length; j++) {
    if (formula[j] == "+" || formula[j] == "*" || formula[j] == "/" || formula[j] == "(" || formula[j] == ")" || 
        formula[j] == "^" || formula[j] == "," || formula[j] == ":" || (formula[j] == "-" && formula[j-1] != "[")) {
      operation[operationIndex] = formula[j];
      operationIndex++;
      parsed[parsedIndex] = formula.substring(startIndex, j);
      parsedIndex++;
      startIndex = j + 1;
    }
    if (j == formula.length - 1) {
      parsed[parsedIndex] = formula.substring(startIndex);
    }
  }
  
  Logger.log(parsed);
  return {
    parsed,
    operation
  };
}

function checkFixedCell(cell) { //checks if a cell is fixed or not; R[1]C[1] (not fixed) versus R1C1 (fixed)
  fixed = true;
  for(var i = 0; i < cell.length; i++) {
    if (cell[i] == '[') {
      fixed = false;
      break;
    }
  }
  return fixed;
}

function isFixedColumn(cell) { //checks if the cell is fixed column (R[1]C1)
  fixed = false;
  for(var i = 0; i < cell.length; i++) {
    if (cell[i] == 'C' && cell[i+1] != '[') {
      fixed = true;
      break;
    }
  }
  return fixed;
}

function isFixedRow(cell) { //checks if the cell is fixed row (R1C[1])
  fixed = false;
  for(var i = 0; i < cell.length; i++) {
    if (cell[i] == 'R' && cell[i+1] != '[') {
      fixed = true;
      break;
    }
  }
  return fixed;
}

function convertFunctions() {
  let rels = getFromUrl(_FYS6);

  //Going down columns
  if(rels[0].range.getColumn() == rels[0].range.getLastColumn()) {
    for (let i = 0; i < rels.length; i++) {
      let formula = rels[i].formula.substring(1, rels[i].formula.length);
      let range = rels[i].range;
      Logger.log("====Formula" + (i + 1) + " " + formula + "====");
      Logger.log("Range from rows %d to %d and cols %d to %d", 
        range.getRow(), range.getLastRow(), range.getColumn(), range.getLastColumn());

      //Separates operations and the parsed R1C1 cells into respective arrays
      let operation = []; //Array of operations (+, -, *, /, (, ), etc) in the formula
      let operationIndex = 0; //Index of the operation array
      let parsed = []; //Array of parsed cells in the formula (R1C1)
      let parsedIndex = 0; //Index of the parsed cells array
      let startIndex = 0; //Start index substring
      for (let j = 0; j < formula.length; j++) {
        if (formula[j] == "+" || formula[j] == "*" || formula[j] == "/" || formula[j] == "(" || formula[j] == ")" || 
            formula[j] == "^" || formula[j] == "," || formula[j] == ":" || (formula[j] == "-" && formula[j-1] != "[")) {
          operation[operationIndex] = formula[j];
          operationIndex++;
          parsed[parsedIndex] = formula.substring(startIndex, j);
          parsedIndex++;
          startIndex = j + 1;
        }
        if (j == formula.length - 1) {
          parsed[parsedIndex] = formula.substring(startIndex);
        }
      }
      Logger.log("Parsed array of R1C1 parts " + parsed);
      for (let k = 0; k < parsed.length; k++) {
        if(/\d/.test(parsed[k]) == false) { //If it is a function like SUM(), MIN(), ROUND(); does not account for functions with numbers like LOG10()
          parsed[k] = parsed[k];
        }
        else if(checkFixedCell(parsed[k]) == true && isNaN(parsed[k])) { //if it is a fixed cell (R1C1, not R[1]C[1]) and not a scalar (number)
          var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
          var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
          colnum = parseInt(colnum);
          parsed[k] = String.fromCharCode(colnum + 64) + rownum;
        }
        else if(!isNaN(parsed[k]) && parsed[k] != 0) { //if it is a scalar (number) not equal to 0
          parsed[k] = parseFloat(parsed[k]);
        }
        else if(parsed[k] == 0) {
          parsed[k] = '0';
        }
        else if(parsed[k] == null) { //if there is nothing there
          parsed[k] = null;
        }
        else { //if it is a not a fixed cell, nor a scalar, nor null (R[1]C[1] or R[1]C1 (fixed column) or R1C[1] (fixed row))
          if (isFixedColumn(parsed[k])) {
            var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
            var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
            colnum = parseInt(colnum);
            parsed[k] = String.fromCharCode(colnum + 64) + "(n+" + rowTranslate + ")";
          }
          else if (isFixedRow(parsed[k])) {
            var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
            var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
            var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
            parsed[k] = column + rownum;
          }
          else {
            var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
            var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
            var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
            parsed[k] = column + "(n+" + rowTranslate + ")";
          }
        }
      }
      Logger.log(parsed);
      Logger.log(operation);
      //Concatenate the converted parses back into formula
      formula = "";
      for (let k = 0; k < parsed.length - 1; k++) {
        if(parsed[k] == null) {
          formula = formula + operation[k];
        }
        else {
          formula = formula + parsed[k] + operation[k];
        }
      }
      if(parsed[parsed.length - 1] != null) {
        formula = formula + parsed[parsed.length - 1];
      }
      Logger.log(formula);
    }
  }

  //Going across rows
  if(rels[0].range.getRow() == rels[0].range.getLastRow()) {
    for (let i = 0; i < rels.length; i++) {
      let formula = rels[i].formula;
      let range = rels[i].range;
      Logger.log("Formula" + (i + 1) + " " + formula);
      Logger.log("Range from rows %d to %d and cols %d to %d", 
        range.getRow(), range.getLastRow(), range.getColumn(), range.getLastColumn());
      
      //Separates operations and the parsed R1C1 cells into respective arrays
      let operation = []; //Array of operations (+, -, *, /, (, ), etc) in the formula
      let operationIndex = 0; //Index of the operation array
      let parsed = []; //Array of parsed cells in the formula (R1C1)
      let parsedIndex = 0; //Index of the parsed cells array
      let startIndex = 0; //Start index substring
      for (let j = 0; j < formula.length; j++) {
        if (formula[j] == "+" || formula[j] == "*" || formula[j] == "/" || formula[j] == "(" || formula[j] == ")" || 
            formula[j] == "^" || formula[j] == "," || formula[j] == ":" || (formula[j] == "-" && formula[j-1] != "[")) {
          operation[operationIndex] = formula[j];
          operationIndex++;
          parsed[parsedIndex] = formula.substring(startIndex, j);
          parsedIndex++;
          startIndex = j + 1;
        }
        if (j == formula.length - 1) {
          parsed[parsedIndex] = formula.substring(startIndex);
        }
      }
      Logger.log("Parsed array of R1C1 parts " + parsed);
      for (let k = 0; k < parsed.length; k++) {
        if(/\d/.test(parsed[k]) == false) { //If it is a function like SUM(), MIN(), ROUND(); does not account for functions with numbers like LOG10()
          parsed[k] = parsed[k];
        }
        else if(checkFixedCell(parsed[k]) == true && isNaN(parsed[k])) { //if it is a fixed cell (R1C1, not R[1]C[1]) and not a scalar (number)
          var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
          var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
          colnum = parseInt(colnum);
          parsed[k] = String.fromCharCode(colnum + 64) + rownum;
        }
        else if(!isNaN(parsed[k]) && parsed[k] != 0) { //if it is a scalar (number) not equal to 0
          parsed[k] = parseFloat(parsed[k]);
        }
        else if(parsed[k] == 0) {
          parsed[k] = '0';
        }
        else if(parsed[k] == null) { //if there is nothing there
          parsed[k] = null;
        }
        else { //if it is a not a fixed cell, nor a scalar, nor null (R[1]C[1] or R[1]C1 (fixed column) or R1C[1] (fixed row))
          if (isFixedColumn(parsed[k])) {
            var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
            var colnum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
            colnum = parseInt(colnum);
            parsed[k] = String.fromCharCode(colnum + 64) + String.fromCharCode(range.getRow() + 48);
          }
          else if (isFixedRow(parsed[k])) {
            var rownum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
            var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
            var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
            parsed[k] = "(Col+" + colTranslate + ")" + rownum;
          }
          else {
            var rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
            var colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
            var column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
            parsed[k] = column + "(n+" + rowTranslate + ")";
          }
        }
      }
      Logger.log(parsed);
      Logger.log(operation);
      //Concatenate the converted parses back into formula
      formula = "";
      for (let k = 0; k < parsed.length - 1; k++) {
        if(parsed[k] == null) {
          formula = formula + operation[k];
        }
        else {
          formula = formula + parsed[k] + operation[k];
        }
      }
      if(parsed[parsed.length - 1] != null) {
        formula = formula + parsed[parsed.length - 1];
      }
      Logger.log(formula);
    }
  }
}

function findRecurrence(sheet) {
  range = sheet.getDataRange();

  //finds the number of columns and rows in the range in spreadsheet (dimensions)
  let numCols = range.getLastColumn();
  let numRows = range.getLastRow();
  //Logger.log("Dimensions of range", numRows, numCols);

  let formulasR1 = range.getFormulasR1C1();

  let recNumCol = 0; //Number of recurrence formulas going down columns in the spreadsheet
  let recListCol = [0]; //Array for the recurrence formulas going down columns
  let recCol = [0]; //The array of columns where an recurrence relation occurs
  let recStartRow = [0]; //The array of rows that the recurrence relation begins
  let recEndRow = [0]; //The array of rows that the recurrence relation ends

  //Finds all recurrence formulas down a column and extracts their cell locations
  for(var j = 0; j <= numCols - 1; j++) { //Start looping from first column
    for(var i = numRows - 1; i >= 0; i--) { //Start looping from last row
      if(formulasR1[i][j][0] != null) { //If the formula is not null, then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i-1][j]) { //Checks if the formula above it is the same
          recCol[recNumCol] = j + 1;
          recStartRow[recNumCol] = i + 1;
          recEndRow[recNumCol] = i + 1; // so that recurrence end doesn't start @ 0
          recListCol[recNumCol] = formulasR1[i][j];
          //Logger.log(i, formulasR1[i][j], formulasR1[i+1][j]);
          while (formulasR1[i][j] == formulasR1[i-1][j]) {
            recStartRow[recNumCol]--;
            i--;
          }
          //Logger.log(recEnd);
          //Logger.log("Recurrence relation", recListCol[recNumCol], 
          //  "at Column", recCol[recNumCol], "Rows", recStartRow[recNumCol], "to", recEndRow[recNumCol]);
          recNumCol++;
          break;
        }
      }
    }
  }

  let recNumRow = 0; //Number of recurrence formulas going across rows in the spreadsheet
  let recListRow = [0]; //Array for the recurrence formulas going across rows
  let recRow = [0]; //The array of rows where an recurrence relation occurs
  let recStartCol = [0]; //The array of columns that the recurrence relation begins
  let recEndCol = [0]; //The array of columns that the recurrence relation ends

  //Finds all recurrence formulas across a row and extracts their cell locations
  for(var i = 0; i <= numRows - 1; i++) { //Start looping from the first row
    for(var j = numCols - 1; j >= 0; j--) { //Start looping from the last column
      if (formulasR1[i][j][0] != null) { //If the formula starts with a '=' (R1C1 notation), then execute the following if statement
        if (formulasR1[i][j] == formulasR1[i][j-1]) {
          recRow[recNumRow] = i + 1;
          recStartCol[recNumRow] = j + 1;
          recEndCol[recNumRow] = j + 1; // so that recurrence end doesn't start @ 0
          recListRow[recNumRow] = formulasR1[i][j];
          //Logger.log(j, formulasR1[i][j], formulasR1[i][j+1]);
          while (formulasR1[i][j] == formulasR1[i][j-1]) {
            recStartCol[recNumRow]--;
            j--;
          }
          //Logger.log("Recurrence relation", recListRow[recNumRow], 
          //"at Row", recRow[recNumRow], "Columns", recStartCol[recNumRow], "to", recEndCol[recNumRow]);
          recNumRow++;
          break;
        }
      }
    }
  }

  let recList = []; //The longest recurrence list out of the two (recListCol & recListRow)
  let recCoord;
  let recStart;
  let recEnd;
  if ((recEndRow[0] - recStartRow[0]) > (recEndCol[0] - recStartCol[0])) { //if the column rec relations are longer than the row ones
    recList = recListCol;
    recCoord = recCol;
    recStart = recStartRow;
    recEnd = recEndRow;
    //Logger.log(recList, recCoord, recStart, recEnd);
    
    let recs = [];
    for (var i = 0; i < recCoord.length; i++) {
      //Logger.log("Main Recurrence relation", recList[i], "at Column", recCoord[i], "Rows", recStart[i], "to", recEnd[i]);
      //Logger.log(recStartRow[i], recCol[i], recEndRow[i] - recStartRow[i] + 1, 1);
      recs.push({
        formula: recList[i],
        range: sheet.getRange(recStartRow[i], recCol[i], recEndRow[i] - recStartRow[i] + 1, 1)
      });
    }
    Logger.log(recs);
    return recs;
  }
  else {
    recList = recListRow;
    recCoord = recRow;
    recStart = recStartCol;
    recEnd = recEndCol;
    
    //Logger.log("********");
    //Logger.log(recList, recCoord, recStart, recEnd);
    
    let recs = [];
    for (var i = 0; i < recCoord.length; i++) {
      //Logger.log("Main Recurrence relation", recList[i], "at Row", recCoord[i], "Columns", recStart[i], "to", recEnd[i]);
      //Logger.log(recRow[i], recStartCol[i], 1, recEndCol[i] - recStartCol[i] + 1);
      recs.push({
        formula: recList[i],
        range: sheet.getRange(recRow[i], recStartCol[i], 1, recEndCol[i] - recStartCol[i] + 1)
      });
    }
    Logger.log(recs);
    return recs;
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

function testFindRecurrence() {
  Logger.log("==== Testing Find Recurrence ====");
  let rels = findRecurrence(SpreadsheetApp.openByUrl(_SHEET_URL).getSheets()[0]);
  Logger.log("----------------------------").log("Result");
  for (let i = 0; i < rels.length; i++) {
    Logger.log("== %d ==", i);
    Logger.log(rels[i]);
    let range = rels[i].range;
    Logger.log("Formula", rels[i].formula)
    Logger.log("Range from rows %d to %d and cols %d to %d", range.getRow(), range.getLastRow(), range.getColumn(), range.getLastColumn());
  }
}