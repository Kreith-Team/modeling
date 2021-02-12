"use strict";

const graphStyleStr = `
core {
  active-bg-size: 0;
}

node, edge {
  events: no;
}

node {
  text-wrap: wrap;
  text-valign: center;
  text-halign: center;
  width: label;
}

.stock {
  shape: rectangle;
}

.variable {
  shape: diamond;
}

.constant {
  shape: ellipse;
}

edge {
  curve-style: bezier;
  target-arrow-shape: triangle;
}

.flow {
  width: 10px;
}

.bidirectional {
  source-arrow-shape: triangle;
}
`

const data = 		{"style":[{"selector":"#0","style":{"background-color":"hsl(0, 100%, 85%)","label":"B8:B24"}},{"selector":"#1","style":{"background-color":"hsl(30, 100%, 85%)","label":"C8:C24"}},{"selector":"#2","style":{"background-color":"hsl(60, 100%, 85%)","label":"D8:D24"}},{"selector":"#3","style":{"background-color":"hsl(90, 100%, 85%)","label":"E8:E24"}},{"selector":"#4","style":{"background-color":"hsl(120, 100%, 85%)","label":"F8:F24"}},{"selector":"#5","style":{"background-color":"hsl(150, 100%, 85%)","label":"G8:G24"}},{"selector":"#6","style":{"background-color":"hsl(180, 100%, 85%)","label":"H8:H24"}},{"selector":"#7","style":{"background-color":"hsl(210, 100%, 85%)","label":"I8:I24"}},{"selector":"#8","style":{"background-color":"hsl(240, 100%, 85%)","label":"J8:J24"}},{"selector":"#9","style":{"background-color":"hsl(270, 100%, 85%)","label":"E6"}},{"selector":"#10","style":{"background-color":"hsl(300, 100%, 85%)","label":"H6"}},{"selector":"#11","style":{"background-color":"hsl(330, 100%, 85%)","label":"D3"}}],"elements":[{"group":"nodes","data":{"id":"0"},"classes":["stock"]},{"group":"nodes","data":{"id":"1"},"classes":["stock"]},{"group":"nodes","data":{"id":"2"},"classes":["variable"]},{"group":"nodes","data":{"id":"3"},"classes":["variable"]},{"group":"nodes","data":{"id":"4"},"classes":["stock"]},{"group":"nodes","data":{"id":"5"},"classes":["variable"]},{"group":"nodes","data":{"id":"6"},"classes":["variable"]},{"group":"nodes","data":{"id":"7"},"classes":["variable"]},{"group":"nodes","data":{"id":"8"},"classes":["variable"]},{"group":"nodes","data":{"id":"9"},"classes":["constant"]},{"group":"nodes","data":{"id":"10"},"classes":["constant"]},{"group":"nodes","data":{"id":"11"},"classes":["constant"]},{"group":"edges","data":{"id":"12","source":"0","target":"0"},"classes":["influence"]},{"group":"edges","data":{"id":"13","source":"1","target":"1"},"classes":["influence"]},{"group":"edges","data":{"id":"14","source":"8","target":"1"},"classes":["influence"]},{"group":"edges","data":{"id":"15","source":"1","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"16","source":"9","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"17","source":"2","target":"3"},"classes":["influence"]},{"group":"edges","data":{"id":"18","source":"4","target":"4"},"classes":["influence"]},{"group":"edges","data":{"id":"19","source":"8","target":"4"},"classes":["influence"]},{"group":"edges","data":{"id":"20","source":"4","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"21","source":"10","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"22","source":"5","target":"6"},"classes":["influence"]},{"group":"edges","data":{"id":"23","source":"3","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"24","source":"6","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"25","source":"7","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"26","source":"1","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"27","source":"11","target":"8"},"classes":["influence"]}]}

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: data.elements,
  boxSelectionEnabled: false,
  autoungrabify: true,
  autounselectify: true,
  layout: {
    name: 'grid',
    nodeDimensionsIncludeLabels: true
  },
  style: graphStyleStr,
  zoom: 1
});

cy.style(cy.style().json().concat(data.style));

console.log(cy)


/******* ELEMENT FACTORIES *********
 * Functions that return Cytoscape-style
 * objects corresponding to each type of
 * object in the model
************************************/
function buildStock(id) {
  return ({
    group: 'nodes',
    data: {
      id: id
    },
    classes: ['stock']
  });
}

function buildConstant(id) {
  return ({
    group: 'nodes',
    data: {
      id: id
    },
    classes: ['constant']
  });
}

function buildVariable(id) {
  return ({
    group: 'nodes',
    data: {
      id: id
    },
    classes: ['variable']
  });
}

function buildFlow(id, source, target, bidirectional = false) {
  return ({
    group: 'edges',
    data: {
      id: id,
      source: source,
      target: target,
    },
    classes: bidirectional ? ['flow', 'bidirectional'] : ['flow']
  });
}

function buildInfluence(id, source, target) {
  return ({
    group: 'edges',
    data: {
      id: id,
      source: source,
      target: target,
    },
    classes: ['influence']
  });
}

function buildCloud(id) {
  return ({
    group: 'nodes',
    data: {
      id: id
    },
    classes: ['cloud']
  });
}

function buildDelay(id) {
  return ({
    group: 'nodes',
    data: {
      id: id
    },
    classes: ['delay']
  });
}
