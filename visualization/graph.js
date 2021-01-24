"use strict";

const graphStyleStr = `
core {
  active-bg-size: 0;
}

node, edge {
  events: no;
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

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: [
    buildStock('s1'),
    buildStock('s2'),
    buildFlow('f1', 's1', 's2', true),
    buildConstant('c1'),
    buildVariable('v1'),
    buildInfluence('i1', 'c1', 'v1')
  ],
  boxSelectionEnabled: false,
  autoungrabify: true,
  autounselectify: true,
  layout: {
    name: 'grid'
  },
  style: graphStyleStr,
  zoom: 1
});

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