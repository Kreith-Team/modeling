_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"

function findNames() {
  //if it is a column range (like A1:A10)
  //  find the name above or below the range
  //if it is a row range (like A1:J10)
  //  find the name to the right or left of the range
  range = SpreadsheetApp.openByUrl(_FYS4).getRange("B6:B10");
  // https://developers.google.com/apps-script/reference/spreadsheet/range#offset(Integer,Integer,Integer)
  let colRange = false; //bool for if it is a column range
  let rowRange = false; //bool for if it is a row range
  if(range.getNumRows() > 1) {
    colRange = true;
  }
  else if(range.getNumColumns() > 1) {
    rowRange = true;
  }

  Logger.log(range.getDisplayValues())
}
