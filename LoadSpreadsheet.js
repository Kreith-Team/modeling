_SHEET_URL = "https://docs.google.com/spreadsheets/d/1PyzkC1h1jwPy9Q_wC6lWsO0sUmWmVkvP2EallryNO1g/"
_FYS3 = "https://docs.google.com/spreadsheets/d/12lQqIUoQCMatbAJye9c5FuTYP0HqmYyDqT8yOYp-bzI/edit#gid=104791918"
_FYS4 = "https://docs.google.com/spreadsheets/d/1-_CPeBmuPuzvEGhtXrUZPe2-zn__Kzfim5aKsskPle8/edit#gid=581941400"
_FYS6 = "https://docs.google.com/spreadsheets/d/1noIrdtO80akdLUh0PtfpiSZRHnK1Cqe1DvD7O1bGD9U/edit#gid=939761514"
_FYS7 = "https://docs.google.com/spreadsheets/d/1g0l5zXlH-KNlI2EZsqCJrIrFo9p56uLkRbn0NxxPMac/edit#gid=1150061696"
_FYS8 = "https://docs.google.com/spreadsheets/d/1igyJpB-8rUI43PIKCvCXFCZLYpEifZrfXe9VtwRkgtQ/edit#gid=909277378"
_FYS9 = "https://docs.google.com/spreadsheets/d/1W6NRB1WS0WVSo1esPXlIWOvjVO_XqkNdjTuLT6bXigk/edit#gid=485567316"
N = 0
const category = {
  VALUE: "VALUE", // explicit numeric/scalar value
  RELATION: "RELATION", // relative reference to relation
  CONSTANT: "CONSTANT", // absolute reference
  FUNCTION: "FUNCTON", // spreadsheet function
  OTHER: "OTHER",
  EMPTY: "EMPTY" // placeholder
}

class Model {
  constructor() {
    this.parameters = new Map();

    this.n = 0;
  }

  addConstant(range) {
    const c = new Constant(this.generateID(), range);

    this.parameters.set(c.id, c);

    return c;
  }
  addRelation(range) {
    const r = new Relation(this.generateID(), range);

    this.parameters.set(r.id, r);

    return r;
  }

  // returns iterator to model relations and constants
  getParameters() {
    return this.parameters.values();
  }
  numParameters() {
    return this.parameters.size;
  }

  generateID() {
    this.n += 1;
    return (this.n - 1).toString();
  }
}

class Operand {
  constructor(element, displacement = undefined) {
    this.element = element;
    this.displacement = displacement;
  }

  getDisplacement() {
    return this.displacement;
  }
  getElement() {
    return this.element;
  }
}

class Element {
  constructor(type) {
    this.type = type
  }

  isValue() {
    return this.type == category.VALUE;
  }
  isRelation() {
    return this.type == category.RELATION;
  }
  isConstant() {
    return this.type == category.CONSTANT;
  }
  isFunction() {
    return this.type == category.FUNCTION;
  }
  isOther() {
    return this.type == category.OTHER;
  }
}

// constants and relationships
class Parameter extends Element {
  constructor(type, id, range) {
    super(type)
    this.id = id;
    this.range = range;
  }

  getID() {
    return this.id;
  }

  getRange() {
    return this.range;
  }
}

class Relation extends Parameter {
  constructor(id, range) {
    super(category.RELATION, id, range);

    this.operators = [];
    this.operands = [];
    
    // tracks recursive operand indexes and depths
    this.iRecursive = [];
    this.depthRecursion = 0;

    this.parents = []; // ids
  }

  getIterator() {
    let i = 0;
    let operators = this.operators;
    let operands = this.operands;

    const iterator = {
      next: function() {
        let result;
        if (i < operands.length) {
          result = { done: false, value: [(i > 0 ? operators[i - 1] : null), operands[i]] };
          i++;
        } else {
          result = { done: true, value: undefined};
        }
        return result
      }
    };
    return iterator;
  }
  isRecursive() {
    return this.iRecursive.length > 0;
  }

  setOperators(operators) {
    this.operators = operators;
  }
  addOperand(element, displacement = undefined) {
    this.operands.push(new Operand(element, displacement));

    // check for recursive reference
    if (element.isRelation() && this.id == element.id) { // recursive reference
      this.iRecursive.push(this.operands.length - 1);
      if (displacement > this.depthRecursion) {
        this.depthRecursion = displacement;
        this.range = (this.range.getColumn() == this.range.getLastColumn()) ?
          this.range.offset(-displacement, 0, this.range.getHeight() + displacement) :
          this.range.offset(0, -displacement, this.range.getHeight(), this.range.getWidth() + displacement);
      }
    }

    if (element instanceof Parameter) {
      this.parents.push(element.id);
    }
  }
}

class Constant extends Parameter {
  constructor(id, range) {
    super(category.CONSTANT, id, range);
  }
}

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

function getUIData(sheet = SpreadsheetApp.openByUrl(_FYS3).getSheets()[0]) {
  const model = extractData(sheet);

  const style = buildStyle(model);
  const [elements, alignmentConstraint, relativePlacementConstraint] = buildGraph(model);

  const ui = {
    style,
    elements,
    alignmentConstraint,
    relativePlacementConstraint
  };

  Logger.log(JSON.stringify(ui));
  
  return ui;
}

function buildStyle(m) {
  let colorsDefault = buildColorList(m.numParameters());

  let colors = Array.from(
    m.getParameters(),
    (param, i) => {
      let bg = param.getRange().getBackground();
      return bg == "#ffffff" ? colorsDefault[i] : bg;
    }
  );

  let nodeStyles = Array.from(
    m.getParameters(),
    (param, i) => {
      return {
        selector: "#" + param.getID(),
        style: {
          'background-color': colors[i],
          'label': findNames(param.getRange()),
          //'line-color': colors[i],
          //'source-arrow-color': colors[i],
          //'target-arrow-color': colors[i]
        }
      };
    }
  );

  let influenceStyles = Array.from(
    m.getParameters(),
    (param, i) => {
      return {
        selector: /*".influence[source = \"" + param.getID() + "\"]" + ", " +*/ ".flow-edge[node=\"" + param.getID() + "\"]",
        style: {
          'line-color': colors[i],
          'source-arrow-color': colors[i],
          'target-arrow-color': colors[i]
        }
      };
    }
  );

  return nodeStyles.concat(influenceStyles);
}

// returns a list of n evenly-distributed HSL-style color codes
function buildColorList(n) {
  return Array.from({length: n}, (_, i) => `hsl(${(i/n)*360}, 100%, 85%)`);
}

// Builds necessary non-style parameters for cytoscape graph
// Return: [elements, alignmentConstraint, relativePlacementConstraint]
// elements - List of elements to pass into graph initialziation
// alignmentConstraint - Vertically aligned flows (pass into layout)
// relativePlacementConstraint - Constraints that force correct placement of flow nodes (pass into layout)
function buildGraph(m) {
  // class to scaffold Cytoscape graph building
  const GraphCollection = class {
    constructor() {
      this.collection = new Map()
    }
    push(element) {
      Logger.log("Pushing element " + element.data.id + " to map");
      this.collection.set(element.data.id, element) 
    }
    get(id) {
      return this.collection.get(id);
    }
    toArray() {
      return Array.from(this.collection.values())
    }
  }

  let v = new GraphCollection();
  let e = new GraphCollection();
  let constraints = [];
  let relativePlacementConstraint = [];

  const addStock = (p) => v.push(buildStock(p.getID()));
  const addConstant = (p) => v.push(buildConstant(p.getID()));
  const addVariable = (p) => v.push(buildVariable(p.getID()));
  const addInfluence = (idSrc, idDest) => e.push(buildInfluence(m.generateID(), idSrc, idDest));
  const addFlowEdge = (idSrc, idDest, idNode, bidirectional = false) => {
    const id = "f" + m.generateID()
    e.push(buildFlowEdge(id + "i", idSrc, idNode, idNode, true, bidirectional));
    e.push(buildFlowEdge(id + "f", idNode, idDest, idNode, false, bidirectional));
    return id;
  }
  const addFlowNode = (id) => e.push(buildFlowNode(id));
  const addCloud = () => {
    const id = m.generateID();
    e.push(buildCloud(id));
    return id;
  }

  let Flow = class {
    constructor(stockOut, stockIn, influences, operators) {
      this.stockOut = stockOut;
      this.stockIn = stockIn;
      this.influences = influences;
      this.operators = operators;
    }

    // Check if two flows come together to form a single flow between two stocks
    isComplement(flow) {
      return (
        ((this.stockOut === null && flow.stockIn === null) ||
        ((flow.stockOut === null && this.stockIn === null))) &&
        equals(this.influences, flow.influences) &&
        equals(this.operators, flow.operators)
      );
    }

    getID() {
      return this.id
    }

    add() {
      // Build clouds if no source/dest specified
      const src = this.stockOut === null ? addCloud() : this.stockOut.getID();
      const dest = this.stockIn === null ? addCloud() : this.stockIn.getID();
      let idNode;
      if (this.influences.length == 1 && this.influences[0] instanceof Parameter) { // combined variable/flow
        idNode = this.influences[0].getID()
        Logger.log("XNODE: " + idNode);
        addFlowEdge(src, dest, idNode, false);
        v.get(idNode).classes = ['flow-node'];
      } else { // separate flow
        Logger.log("here!!")
        Logger.log(this.influences.length);
        idNode = m.generateID();
        addFlowNode(idNode);
        addFlowEdge(src, dest, idNode, false);

        // add influences to flow node
        for (const influence of this.influences) {
          if (influence.isRelation() || influence.isConstant()) {
            Logger.log("Dealing with influence " + influence.getID());
            addInfluence(influence.getID(), idNode);
          }
        }
      }

      // Check if any elements already in array
      let iConstraint = constraints.findIndex((ids) => ids.includes(src) || ids.includes(dest));

      if (iConstraint != -1) {
        let ids = constraints[iConstraint];
        if (ids.includes(src)) {
          ids.push(dest);
        } else if (ids.includes(dest)) {
          ids.push(src);
        } else {
          Logger.log("Something may have gone wrong with building constraints - tried to add IDs, but both were already constrained");
        }
      } else {
        constraints.push([src, idNode, dest]);
      }

      // TODO: OPTIONAL - also skip if bidirectional
      relativePlacementConstraint.push({left: src, right: dest});
    }
  };

  let inflows = []; // list of class Flow instances
  let outflows = [];

  const addInfluences = (p) => {
    // Iterate over elements of the equation
    const it = p.getIterator();
    let result = it.next();
    while (!result.done) {
      [operator, operand] = result.value; // get iterator values
      if (operand !== undefined && operand !== null) {
        let element = operand.getElement();

        if (element.isRelation() || element.isConstant()) {
          addInfluence(element.getID(), p.getID());
        }
      }

      result = it.next(); // continue iterating
    }
  }

  const addFlows = (p) => {
    let positives = []; // parameters with a positive influence on the formula
    let negatives = []; // parameters with a negative influence on the formula
    let opsPositive = [];
    let opsNegative = [];

    // Iterate over elements of the equation
    const it = p.getIterator();
    let result = it.next();

    parenDepth = 0; // number of parentheses deep
    
    while (!result.done) {
      const POS = true;
      const NEG = false;

      [operator, operand] = result.value; // get iterator values

      let current = POS; // keeps track of + or - was last seen
      let stack = []; // keeps track of positivity/negativity of each parenthetical level

      if (operator == "(") {
        stack.push(current);
      } else if (operator == ")") {
        current = stack.pop();
      } else if (operator == "+") {
        current = POS;
      } else if (operator == "-") {
        current = NEG;
      }

      if (operand !== undefined && operand !== null) {
        let element = operand.getElement();

        // skip stock basis
        if (p.getID() == element.getID() && operand.getDisplacement() == 1) {
          result = it.next();
          continue;
        }

        // note whether element is positive or negative influence
        if (current == POS) {
          positives.push(element);
          if (operator !== "+" && operator !== "-") {
            opsPositive.push(operand);
          }
        } else {
          negatives.push(element);
          if (operator !== "+" && operator !== "-") {
            opsNegative.push(operand);
          }
        }
      }

      result = it.next(); // continue iterating
    }

    if (positives.length >= 1) {
      inflows.push(new Flow(null, p, positives, opsPositive));
    }

    if (negatives.length >= 1) {
      outflows.push(new Flow(p, null, negatives, opsNegative));
    }
  }

  // Build stock, constant, and variable nodes
  for (const p of m.getParameters()) {
    if (p.isRelation()) { // stock or variable
      if (p.isRecursive()) { // stock
        // **NOTE: ADD ADDITIONAL CONDITION that min recursive depth is 1?
        // Add a stock node to the graph
        addStock(p);
        addFlows(p);
      } else { // variable
        // Add a variable node to the graph
        addVariable(p);
        addInfluences(p);
      }
    } else if (p.isConstant()) { // variable
      addConstant(p);
    }
  }

  // Flows between two stocks
  let localFlows = [];
  // Indices of inflows and outflows that have been combined into local flows
  let iContributingInflows = [];
  let iContributingOutflows = [];

  // combine complementary flows together into stock-stock flow
  for (let iIn = 0; iIn < inflows.length; iIn++) {
    const inflow = inflows[iIn];
    for (let iOut = 0; iOut < outflows.length; iOut++) {
      const outflow = outflows[iOut];
      if (inflow.isComplement(outflow)) {
        // push combined flow
        localFlows.push(new Flow(outflow.stockOut, inflow.stockIn, outflow.influences, outflow.operators));
        iContributingInflows.push(iIn);
        iContributingOutflows.push(iOut);
      }
    }
  }
  
  // create list of all flows
  const flows = localFlows.concat(
    inflows.filter((_, i) => !iContributingInflows.includes(i)),
    outflows.filter((_, i) => !iContributingOutflows.includes(i))
  );

  for (const flow of flows) {
    flow.add()
  }

  let graph = v.toArray().concat(e.toArray());

  return [
    graph,
    {horizontal: constraints},
    relativePlacementConstraint
  ];
}

function extractData(sheet) {
  let m = new Model();

  // Get and parse relations
  relationsFound = findRecurrence(sheet);
  parses = convertFunctions(relationsFound);

  // looks up ID of constant or relation based on position
  let pos2rel = new Map();
  let pos2const = new Map();
  // whether relations are in columns (True) or rows (False)
  const overColumns = (relationsFound[0].range.getColumn() == relationsFound[0].range.getLastColumn());

  // Initial pass through relations to associate location and ID so that ranges can be linked later
  for (let rel of relationsFound) {
    pos2rel.set(overColumns ? rel.range.getColumn() : rel.range.getRow(), m.addRelation(rel.range));
  }

  // Second pass: find constants, check for recurrence relations and expand ranges if necessary
  let i = 0; // track progress through relations
  for (let rel of pos2rel.values()) {
    const {types, tokens, operators} = parses[i];
    rel.setOperators(operators);

    for (let j = 0; j < types.length; j++) {
      const type = types[j];
      const token = tokens[j];

      if (type == category.RELATION) {
        let operand = pos2rel.get(token.pos); // attempt to get ID of range
        let displacement = Math.abs(token.offset);

        // Handle range that wasn't found by findRecurrence()
        if(operand === undefined) {
          rel.addOperand(new Element(category.OTHER, displacement)); // EXPAND
        } else {
          rel.addOperand(operand, displacement);
        }
      } else if (type == category.CONSTANT) {
        // constant hasn't been referenced yet
        let constant = pos2const.get(token.pos);

        if (constant === undefined) {
          constant = m.addConstant(sheet.getRange(token));
          pos2const.set(token, constant);
        }

        rel.addOperand(constant);
      }
    }
    i++;
  }

  return m;
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

// From https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

// https://www.30secondsofcode.org/blog/s/javascript-array-comparison
function equals(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}