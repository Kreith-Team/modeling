"use strict";

const graphStyle = [
  {
    "selector": "core",
    "style": {
      "active-bg-size": "0px"
    }
  },
  {
    "selector": "node, edge",
    "style": {
      "events": "no"
    }
  },
  {
    "selector": "node",
    "style": {
      "text-wrap": "wrap",
      "text-valign": "center",
      "text-halign": "center",
      "width": "label"
    }
  },
  {
    "selector": ".stock",
    "style": {
      "shape": "rectangle"
    }
  },
  {
    "selector": ".variable",
    "style": {
      "shape": "diamond"
    }
  },
  {
    "selector": ".constant",
    "style": {
      "shape": "ellipse"
    }
  },
  {
    "selector": ".cloud",
    "style": {
      "shape": "star"
    }
  },
  {
    "selector": "edge",
    "style": {
      "curve-style": "taxi",
      "target-arrow-shape": "triangle"
    }
  },
  {
    "selector": ".flow-node",
    "style": {
      "shape": "heptagon"
    }
  },
  {
    "selector": ".flow-edge",
    "style": {
      "width": "10px"
    }
  },
  {
    "selector": ".bidirectional",
    "style": {
      "source-arrow-shape": "triangle"
    }
  }
]

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

.cloud {
  shape: star;
}

edge {
  curve-style: taxi;
  target-arrow-shape: triangle;
}

.flow-node {
  shape: heptagon;
}

.flow-edge {
  width: 10px;
}

.bidirectional {
  source-arrow-shape: triangle;
}
`

const data = 	{"style":[{"selector":"#0","style":{"background-color":"hsl(0, 100%, 85%)","label":"Years"}},{"selector":"#1","style":{"background-color":"hsl(30, 100%, 85%)","label":"Population"}},{"selector":"#2","style":{"background-color":"hsl(60, 100%, 85%)","label":"People per Billion GDP"}},{"selector":"#3","style":{"background-color":"hsl(90, 100%, 85%)","label":"People per Million GDP"}},{"selector":"#4","style":{"background-color":"hsl(120, 100%, 85%)","label":"Population"}},{"selector":"#5","style":{"background-color":"hsl(150, 100%, 85%)","label":"People per Billion GDP"}},{"selector":"#6","style":{"background-color":"hsl(180, 100%, 85%)","label":"People per Million GDP"}},{"selector":"#7","style":{"background-color":"hsl(210, 100%, 85%)","label":"Driving Force"}},{"selector":"#8","style":{"background-color":"hsl(240, 100%, 85%)","label":"Number of Migrants"}},{"selector":"#9","style":{"background-color":"hsl(270, 100%, 85%)","label":1000}},{"selector":"#10","style":{"background-color":"hsl(300, 100%, 85%)","label":20000}},{"selector":"#11","style":{"background-color":"hsl(330, 100%, 85%)","label":1}}],"elements":[{"group":"nodes","data":{"id":"0"},"classes":["stock"]},{"group":"nodes","data":{"id":"1"},"classes":["stock"]},{"group":"nodes","data":{"id":"2"},"classes":["variable"]},{"group":"nodes","data":{"id":"3"},"classes":["variable"]},{"group":"nodes","data":{"id":"4"},"classes":["stock"]},{"group":"nodes","data":{"id":"5"},"classes":["variable"]},{"group":"nodes","data":{"id":"6"},"classes":["variable"]},{"group":"nodes","data":{"id":"7"},"classes":["variable"]},{"group":"nodes","data":{"id":"8"},"classes":["variable"]},{"group":"nodes","data":{"id":"9"},"classes":["constant"]},{"group":"nodes","data":{"id":"10"},"classes":["constant"]},{"group":"nodes","data":{"id":"11"},"classes":["constant"]},{"group":"edges","data":{"id":"12","source":"1","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"13","source":"9","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"14","source":"2","target":"3"},"classes":["influence"]},{"group":"edges","data":{"id":"15","source":"4","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"16","source":"10","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"17","source":"5","target":"6"},"classes":["influence"]},{"group":"edges","data":{"id":"18","source":"3","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"19","source":"6","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"20","source":"7","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"21","source":"1","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"22","source":"11","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"f23","source":"1","target":"4","node":"8"},"classes":["flow-edge"]}]}

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: data.elements,
  boxSelectionEnabled: false,
  autoungrabify: true,
  autounselectify: true,
  layout: {
    name: 'fcose',

    quality: "default",
    nodeDimensionsIncludeLabels: true,

    alignmentConstraint: {horizontal: [['1', '8', '4']]},
    relativePlacementConstraint: [{left: '1', right: '8'}, {left: '8', right: '4'}]
    // animate: false
  },
  style: graphStyle.concat(data.style),
  zoom: 1
});

// position flow nodes
/*for (const edge of cy.edges(".flow-edge")) {
  const node = cy.nodes("#" + edge.data("node"));
  console.log(node.json());
  console.log(edge.json());
  console.log(edge.midpoint())
  node.position(edge.midpoint());
}*/

// add additional stylesheet
//console.log(JSON.stringify(cy.style().json()));
//cy.style(cy.style().json().concat(data.style));

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

function buildFlowEdge(id, source, target, bidirectional = false) {
  return {
    group: 'edges',
    data: {
      id: "f" + id,
      source: source,
      target: target
    },
    classes: bidirectional ? ['flow-edge', 'bidirectional'] : ['flow-edge']
  };
}

function buildFlowNode(id) {
  return {
    group: 'nodes',
    data: {
      id: id,
      edge: "f" + id
    },
    classes: ['flow-node']
  };
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
