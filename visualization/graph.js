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
      //"events": "no",
      "z-index-compare": "manual"
    }
  },
  {
    "selector": "node",
    "style": {
      "text-wrap": "wrap",
      "text-valign": "center",
      "text-halign": "center",
      "width": "label",
      "border-width": "1.5",
      "border-color": "rgb(64,64,64)",

      "z-index": "0"
    }
  },
  {
    "selector": ".stock",
    "style": {
      "shape": "rectangle",
      "events": "no",
      "height": "75"
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
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",

      "z-index": "2"
    }
  },
  {
    "selector": ".flow-node",
    "style": {
      "shape": "rectangle",
      "height": "20",
      "width": "20",
      "visibility": "hidden"
    }
  },
  {
    "selector": ".flow-edge",
    "style": {
      "width": "20",

      "z-index": "1"
    }
  },
  {
    "selector": ".bidirectional",
    "style": {
      "source-arrow-shape": "triangle"
    }
  }
];

const data = 	{"style":[{"selector":".0","style":{"background-color":"#ddd9c3","label":"Years","line-color":"#ddd9c3","source-arrow-color":"#ddd9c3","target-arrow-color":"#ddd9c3"}},{"selector":".1","style":{"background-color":"#fbd4b4","label":"Population","line-color":"#fbd4b4","source-arrow-color":"#fbd4b4","target-arrow-color":"#fbd4b4"}},{"selector":".2","style":{"background-color":"#fbd4b4","label":"People per Billion GDP","line-color":"#fbd4b4","source-arrow-color":"#fbd4b4","target-arrow-color":"#fbd4b4"}},{"selector":".3","style":{"background-color":"#fbd4b4","label":"People per Million GDP","line-color":"#fbd4b4","source-arrow-color":"#fbd4b4","target-arrow-color":"#fbd4b4"}},{"selector":".4","style":{"background-color":"#92cddc","label":"Population","line-color":"#92cddc","source-arrow-color":"#92cddc","target-arrow-color":"#92cddc"}},{"selector":".5","style":{"background-color":"#92cddc","label":"People per Billion GDP","line-color":"#92cddc","source-arrow-color":"#92cddc","target-arrow-color":"#92cddc"}},{"selector":".6","style":{"background-color":"#92cddc","label":"People per Million GDP","line-color":"#92cddc","source-arrow-color":"#92cddc","target-arrow-color":"#92cddc"}},{"selector":".7","style":{"background-color":"#b4a7d6","label":"Driving Force","line-color":"#b4a7d6","source-arrow-color":"#b4a7d6","target-arrow-color":"#b4a7d6"}},{"selector":".8","style":{"background-color":"#b4a7d6","label":"Number of Migrants","line-color":"#b4a7d6","source-arrow-color":"#b4a7d6","target-arrow-color":"#b4a7d6"}},{"selector":".9","style":{"background-color":"#fbd4b4","label":"GDP of A in Billions","line-color":"#fbd4b4","source-arrow-color":"#fbd4b4","target-arrow-color":"#fbd4b4"}},{"selector":".10","style":{"background-color":"#92cddc","label":"GDP of B in Billions","line-color":"#92cddc","source-arrow-color":"#92cddc","target-arrow-color":"#92cddc"}},{"selector":".11","style":{"background-color":"hsl(330, 100%, 85%)","label":"Mobility Factor","line-color":"hsl(330, 100%, 85%)","source-arrow-color":"hsl(330, 100%, 85%)","target-arrow-color":"hsl(330, 100%, 85%)"}}],"elements":[{"group":"nodes","data":{"id":"0"},"classes":["stock","0"]},{"group":"nodes","data":{"id":"1"},"classes":["stock","1"]},{"group":"nodes","data":{"id":"2"},"classes":["variable","2"]},{"group":"nodes","data":{"id":"3"},"classes":["variable","3"]},{"group":"nodes","data":{"id":"4"},"classes":["stock","4"]},{"group":"nodes","data":{"id":"5"},"classes":["variable","5"]},{"group":"nodes","data":{"id":"6"},"classes":["variable","6"]},{"group":"nodes","data":{"id":"7"},"classes":["variable","7"]},{"group":"nodes","data":{"id":"8"},"classes":["flow-node"]},{"group":"nodes","data":{"id":"9"},"classes":["constant","9"]},{"group":"nodes","data":{"id":"10"},"classes":["constant","10"]},{"group":"nodes","data":{"id":"11"},"classes":["constant","11"]},{"group":"edges","data":{"id":"12","source":"1","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"13","source":"9","target":"2"},"classes":["influence"]},{"group":"edges","data":{"id":"14","source":"2","target":"3"},"classes":["influence"]},{"group":"edges","data":{"id":"15","source":"4","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"16","source":"10","target":"5"},"classes":["influence"]},{"group":"edges","data":{"id":"17","source":"5","target":"6"},"classes":["influence"]},{"group":"edges","data":{"id":"18","source":"3","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"19","source":"6","target":"7"},"classes":["influence"]},{"group":"edges","data":{"id":"20","source":"7","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"21","source":"1","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"22","source":"11","target":"8"},"classes":["influence"]},{"group":"edges","data":{"id":"f23","source":"1","target":"4","node":"8"},"classes":["flow-edge","8"]}],"alignmentConstraint":{"horizontal":[["1","8","4"]]},"relativePlacementConstraint":[{"left":"1","right":"8"},{"left":"8","right":"4"}]}

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: data.elements,
  boxSelectionEnabled: false,
  //autoungrabify: true,
  autounselectify: true,
  layout: {
    name: 'klay',
    klay: {
      cycleBreaking: 'GREEDY',
      direction: 'DOWN',
      nodeLayering: 'INTERACTIVE',
      nodePlacement: 'LINEAR_SEGMENTS',
      spacing: 30,
      edgeSpacingFactor: 1.5
    }

    /*name: 'fcose',

    quality: "default",
    nodeDimensionsIncludeLabels: true,

    nodeRepulsion: node => 1500,
    idealEdgeLength: edge => 35,
    edgeElasticity: edge => 0.2,
    gravity: 20,
    gravityRange: 1,

    alignmentConstraint: data.alignmentConstraint,
    relativePlacementConstraint: data.relativePlacementConstraint
    // animate: false*/
  },
  style: graphStyle.concat(data.style),
  zoom: 1
});

// Remove disconnected nodes from the graph [TEMPORARY]
// https://stackoverflow.com/questions/47680037/getting-nodes-without-edges
cy.nodes(function(element){
  if( element.isNode() && element.degree()<1){
      cy.remove(element)
  }
})

// position flow nodes
for (const edge of cy.edges(".flow-edge")) {
  const node = cy.nodes("#" + edge.data("node"));
  console.log(node.json());
  console.log(edge.json());
  console.log(edge.midpoint())
  node.position(edge.midpoint());
}

// add additional stylesheet
//console.log(JSON.stringify(cy.style().json()));
//cy.style(cy.style().json().concat(data.style));

console.log(cy)