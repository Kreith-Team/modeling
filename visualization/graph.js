"use strict";

console.log([
  buildStock('x'),
  buildStock('y'),
  buildFlow('z', 'x', 'y')
])

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: [
    buildStock('x'),
    buildStock('y'),
    buildFlow('z', 'x', 'y')
  ],
  boxSelectionEnabled: false,
  autoungrabify: true,
  autounselectify: true,
  layout: {
    name: 'grid'
  },
  style: cytoscape.stylesheet()
    .selector('core')
      .style({
        'active-bg-size': 0,
        'selection-box-color': 'red'
      })
    .selector('node, edge')
      .style({
        'events': 'no'
      })
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