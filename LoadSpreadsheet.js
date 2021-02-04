_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"

const category = {
  VALUE: "VALUE", // explicit numeric/scalar value
  RELATION: "RELATION", // relative reference to relation
  CONSTANT: "CONSTANT", // absolute reference
  FUNCTION: "FUNCTON", // spreadsheet function
  EMPTY: "EMPTY" // placeholder
}

/*class Relation extends Element {
  constructor(id) {
    super(category.RELATION);
    this.
  }
}*/

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

function extractData(sheet = SpreadsheetApp.openByUrl(_FYS4).getSheets()[0]) {
  // Code to generate arbitrary IDs
  n = 0;
  const generateID = () => {
    n += 1;
    return (n - 1).toString();
  }

  // Get and parse relations
  relationsFound = findRecurrence(sheet)
  parses = convertFunctions(relationsFound);

  console.log("findRecurrence():", relationsFound)

  // Build lists of relations and constants, id lookup table
  let constants = [];
  let relations = [];
  let other = []; // Multi-cell ranges that are not found by findRecurrence()
  let lookup = {}

  // tracks column/row numbers of each relation
  let relPositions = [];

  // looks up ID of constant or relation based on position
  let pos2id = {};

  // whether relations are in columns (True) or rows (False)
  const overColumns = (relationsFound[0].range.getColumn() == relationsFound[0].range.getLastColumn());

  // Creates an entry for a new constant
  const newConstant = (posA1) => {
    const idConstant = generateID();
    pos2id[posA1] = idConstant;
    constants.push(idConstant);
    lookup[idConstant] = ({
      range: sheet.getRange(posA1)
    });
  }

  // Initial pass through relations to associate location and ID so that ranges can be linked later
  for (let rel of relationsFound) {
    // Generate a unique ID for the range
    const id = generateID();
    // Get the range's column or row number
    const pos = overColumns ? range.getColumn() : range.getRow();

    // Save data
    pos2id[pos] = id;
    relations.push(id);
    lookup[id] = {
      range: rel.range,
      recursive: false
    }
  }

  let flows = [];
  let influences = [];

  // Second pass: find constants, check for recurrence relations and expand ranges if necessary
  for (let i = 0; i < relationsFound.length; i++) {
    const {types, tokens, operators} = parses[i];

    // Column or row position of the given relation
    const id = relations[i];
    const r = lookup[id].range;

    for (let j = 0; j < types.length; j++) {
      const type = types[j];
      const token = tokens[j];

      if (type == category.RELATION) {
        let idRange = pos2id[token.pos]; // attempt to get ID of range
        let offset = pos2id[token.offset];

        // Handle range that wasn't found by findRecurrence()
        if(!idRange) {
          idRange = generateID();
          pos2id[token.pos] = idRange;

        }

        if (idRange == id) { // recursive reference
          lookup[id].range = overColumns ?
            r.offset(offset, 0, r.getHeight() - offset) :
            r.offset(0, offset, r.getHeight(), r.getWidth() - offset);
          lookup[id].recursive = true;
        }

        parses[i].tokens[j].id = pos2id[token.pos];
      } else if (type == category.CONSTANT) {
        // constant hasn't been referenced yet
        if (!pos2id[token.pos]) {
          newConstant(token);
        }
        parses[i].tokens[j].id = pos2id[token.pos];
      }
    }
  }

  let x = {
    relations,
    constants,
    other,
    lookup,
    pos2id
  }
  Logger.log(x)
  Logger.log(parses);
}

function convertFunctions(rels = getFromUrl(_FYS6)) {
  let result = [];

  const overColumns = (rels[0].range.getColumn() == rels[0].range.getLastColumn());

  for (let i = 0; i < rels.length; i++) {
    /* PARSING */
    let formula = rels[i].formula.substring(1, rels[i].formula.length);
    let range = rels[i].range;
    // Logger.log("====Formula" + (i + 1) + " " + formula + "====");
    /* Logger.log("Range from rows %d to %d and cols %d to %d", 
      range.getRow(), range.getLastRow(), range.getColumn(), range.getLastColumn()); */

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
    // Logger.log("Parsed array of R1C1 parts " + parsed);

    /* INTERPRETATION */
    types = []
    tokens = []

    for (let k = 0; k < parsed.length; k++) {
      if (parsed[k] === "") {
        types.push(category.EMPTY);
        tokens.push("");
      }
      else if(/\d/.test(parsed[k]) == false) { //If it is a function like SUM(), MIN(), ROUND(); does not account for functions with numbers like LOG10()
        parsed[k] = parsed[k];
        types.push(category.FUNCTION);
        tokens.push(parsed[k])
      }
      else if(checkFixedCell(parsed[k]) == true && isNaN(parsed[k])) { //if it is a fixed cell (R1C1, not R[1]C[1]) and not a scalar (number)
        let rowNum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
        let colNum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
        colNum = parseInt(colNum);
        parsed[k] = String.fromCharCode(colNum + 64) + rowNum;
        types.push(category.CONSTANT);
        tokens.push(String.fromCharCode(colNum + 64) + rowNum);
      }
      else if(!isNaN(parsed[k]) && parsed[k] != 0) { //if it is a scalar (number) not equal to 0
        parsed[k] = parseFloat(parsed[k]);
        types.push(category.VALUE);
        tokens.push(parseFloat(parsed[k]));
      }
      else if(parsed[k] == 0) {
        parsed[k] = '0';
        types.push(category.VALUE);
        tokens.push(0);
      }
      else if(parsed[k] == null) { //if there is nothing there
        parsed[k] = null;
        types.push(category.EMPTY);
        tokens.push(null);
      }
      else { //if it is a not a fixed cell, nor a scalar, nor null (R[1]C[1] or R[1]C1 (fixed column) or R1C[1] (fixed row))
        if (isFixedColumn(parsed[k])) { // R[i]Cj - fixed column, relative row
          let rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
          let colNum = parsed[k].substring(parsed[k].indexOf("C") + 1, parsed[k].length); //Column number
          colNum = parseInt(colNum);
          parsed[k] = overColumns ?
            String.fromCharCode(colNum + 64) + "(n+" + rowTranslate + ")" :
            String.fromCharCode(colNum + 64) + String.fromCharCode(range.getRow() + 48);

          if (overColumns) { // farther back in same relation
            types.push(category.RELATION);
            tokens.push({
              pos: Number(colNum),
              offset: Number(rowTranslate)
            });
          } else { // different relation
            types.push(category.CONSTANT);
            tokens.push(String.fromCharCode(colNum + 64) + String.fromCharCode(range.getRow() + 48));
          }
        }
        else if (isFixedRow(parsed[k])) {
          let rowNum = parsed[k].substring(parsed[k].indexOf("R") + 1, parsed[k].indexOf("C")); //Row number
          let colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
          let column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
          parsed[k] = overColumns ?
            column + rowNum :
            "(Col+" + colTranslate + ")" + rowNum;

          if (overColumns) { // different relation
            types.push(category.CONSTANT);
            tokens.push(column.concat(rowNum));
          } else { // farther back in same relation
            types.push(category.RELATION);
            tokens.push({
              pos: Number(rowNum),
              offset: Number(colTranslate)
            });
          }
        }
        else {
          let rowTranslate = parsed[k].substring(parsed[k].indexOf("R[") + 2, parsed[k].indexOf("]")); //Row translation
          let colTranslate = parsed[k].substring(parsed[k].indexOf("C[") + 2, parsed[k].length - 1); //Column translation
          let column = String.fromCharCode(range.getColumn() + 65 - 1 + parseInt(colTranslate));
          // Logger.log(rowTranslate);
          // Logger.log(colTranslate);
          parsed[k] = column + "(n+" + rowTranslate + ")";
          types.push(category.RELATION);
          if (overColumns) {
            tokens.push({
              pos: range.getColumn() + Number(colTranslate),
              offset: Number(rowTranslate)
            });
          } else {
            tokens.push({
              pos: range.getRow() + Number(rowTranslate),
              offset: Number(colTranslate)
            });
          }
        }
      }
    }
    // Logger.log(types);
    // Logger.log(tokens);
    // Logger.log(parsed);
    // Logger.log(operation);
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
    // Logger.log(formula);

    result.push({
      types: types,
      tokens: tokens,
      parsed: parsed,
      operators: operation
    });
  }

  return result;
}

function checkFixedCell(cell) { //checks if a cell is fixed or not; R[1]C[1] (not fixed) versus R1C1 (fixed)
  fixed = true;
  for(let i = 0; i < cell.length; i++) {
    if (cell[i] == '[') {
      fixed = false;
      break;
    }
  }
  return fixed;
}

function isFixedColumn(cell) { //checks if the cell is fixed column (R[1]C1)
  fixed = false;
  for(let i = 0; i < cell.length; i++) {
    if (cell[i] == 'C' && cell[i+1] != '[') {
      fixed = true;
      break;
    }
  }
  return fixed;
}

function isFixedRow(cell) { //checks if the cell is fixed row (R1C[1])
  fixed = false;
  for(let i = 0; i < cell.length; i++) {
    if (cell[i] == 'R' && cell[i+1] != '[') {
      fixed = true;
      break;
    }
  }
  return fixed;
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
  for(let j = 0; j <= numCols - 1; j++) { //Start looping from first column
    for(let i = numRows - 1; i >= 0; i--) { //Start looping from last row
      if(formulasR1[i][j][0] != null) { //If the formula is not null, then execute the following if statement
        formulasR1[i][j] = formulasR1[i][j].replace(/\s/g, '');
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
  for(let i = 0; i <= numRows - 1; i++) { //Start looping from the first row
    for(let j = numCols - 1; j >= 0; j--) { //Start looping from the last column
      if (formulasR1[i][j][0] != null) { //If the formula starts with a '=' (R1C1 notation), then execute the following if statement
        formulasR1[i][j] = formulasR1[i][j].replace(/\s/g, '');
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
    for (let i = 0; i < recCoord.length; i++) {
      //Logger.log("Main Recurrence relation", recList[i], "at Column", recCoord[i], "Rows", recStart[i], "to", recEnd[i]);
      //Logger.log(recStartRow[i], recCol[i], recEndRow[i] - recStartRow[i] + 1, 1);
      recs.push({
        formula: recList[i],
        range: sheet.getRange(recStartRow[i], recCol[i], recEndRow[i] - recStartRow[i] + 1, 1)
      });
    }
    // Logger.log(recs);
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
    for (let i = 0; i < recCoord.length; i++) {
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
  let spreadsheet = SpreadsheetApp.openById('1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g');
  let sheet = spreadsheet.getSheets()[0];
  let cellVariable = sheet.getCurrentCell().getValue();
  //Logger.log(cellVariable);
  
  //Gets the column and row numbers for the cell
  let range = sheet.getDataRange();
  let col = range.getColumn();
  let row = range.getRow();
  // Logger.log(col);
  // Logger.log(row);

  //The length of the variable name in the cell (with the equals-sign if applicable)
  let varLength = cellVariable.length;
  //Logger.log(cellVariable[varLength-1]);
  let varValue;
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