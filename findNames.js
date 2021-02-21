_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"

function findNames(range = SpreadsheetApp.openByUrl(_SHEET_URL).getRange("D18:F18")) {
  let colRange = false; //bool for if it is a column range
  let rowRange = false; //bool for if it is a row range
  let nameFound = false;//bool for when a name is found
  if(range.getNumRows() > 1) {
    colRange = true;
  }
  else if(range.getNumColumns() > 1) {
    rowRange = true;
  }
//  Logger.log(range.offset(-0,0,1,1).getFormulas()[0][0][0]);
//  Logger.log(range.offset(-0,0,1,1).getValue());
//  Logger.log(!isNaN(range.offset(-0,0,1,1).getValue()));
  Logger.log(range.getDisplayValues());
  let offsetRange = 1;
  var rangeName;
  if(colRange) {
    let startRow = range.getRow();
    //checks how many times the range needs to be offsetted to find a name
    while(!isNaN(range.offset(-offsetRange,0,1,1).getValue()) && startRow - offsetRange > 1) {
      offsetRange++;
    }
    if(isNaN(range.offset(-offsetRange,0,1,1).getValue())) {
      nameFound = true;
    }
  }
  if(rowRange) {
    let startCol = range.getColumn();
    //checks how many times the range needs to be offsetted to find a name
    while(!isNaN(range.offset(0,-offsetRange,1,1).getValue()) && startCol - offsetRange > 1) {
      offsetRange++;
    }
    if(isNaN(range.offset(0,-offsetRange,1,1).getValue())) {
      nameFound = true;
    }
    if(!nameFound) {
      while(!isNaN(range.offset(0,offsetRange,1,1).getValue()) && startCol - offsetRange > 1) {
        offsetRange++;
      }
      if(isNaN(range.offset(0,offsetRange,1,1).getValue())) {
        nameFound = true;
      }
    }
    //while value to the right is NaN, keep going right
    //however many times it went right is the x that is the second argument of .offset
  }
  Logger.log(colRange)
  Logger.log(rowRange)

  if(colRange) {
    range = range.offset(-offsetRange, 0, range.getNumRows() + offsetRange, range.getNumColumns());
  }
  if(rowRange) {
    range = range.offset(0, -offsetRange, range.getNumRows(), range.getNumColumns() + offsetRange);
  }
  
  rangeName = range.getValue();
  Logger.log("NAME: " + rangeName);
  Logger.log(range.getDisplayValues());
  return rangeName;
}
