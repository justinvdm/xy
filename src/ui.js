'use strict';
let _ = require('./utils');
let map = _.map;
let group = _.group;
let createScreen = require('blessed').screen;
let createLine = require('blessed-contrib').line;


function create(opts) {
  let screen = createScreen();
  let line = createLine({showLegend: opts.showLegend});
  screen.append(line);

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  return {
    line,
    screen,
    colors: (opts.colors || randomColors)()
  };
}


function update(ui, state, opts) {
  ui.line.setData(parse(ui, state, opts));
  ui.screen.render();
}


function parse(ui, state, opts) {
  return map(group(state.values, 'x'), d => ({
    title: d.name,
    x: map(d.values, 'x'),
    y: map(d.values, 'y'),
    style: {line: ui.colors(d.name)}
  }));
}


function randomColors() {
  let lookup = {};

  return function nextColor(k) {
    return k in lookup
      ? lookup[k]
      : lookup[k] = randomColor();
  };
}


function randomColor() {
  return [
    Math.random() * 255,
    Math.random() *255,
    Math.random() *255
  ];
}


exports.create = create;
exports.update = update;
exports.parse = parse;
