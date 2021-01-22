"use strict";

const cy = cytoscape({
  container: document.getElementById('graph'),
  elements: [{data: { id: 'a' }}],
  boxSelectionEnabled: false,
  autoungrabify: true,
  autolock: true,
  autounselectify: true,
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