'use strict';
let d3 = require('d3');
let _ = require('./utils');
let map = _.map;
let group = _.group;
let toString = _.toString;
let parseDate = _.parseDate;
let createScreen = require('blessed').screen;
let createLine = require('blessed-contrib').line;

const ftime = {
  start: d3.time.format('%y-%m-%d'),
  milliseconds: d3.time.format('.%L'),
  seconds: d3.time.format(':%S'),
  minutes: d3.time.format('%H:%M '),
  hours: d3.time.format('%I %p'),
  fallback: d3.time.format('%y-%m')
};


function create(opts) {
  let screen = createScreen();

  let line = createLine({
    showLegend: opts.showLegend
  });

  screen.append(line);

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  return {
    line,
    screen,
    colors: (opts.colors || randomColors)(),
    timeFormatter: timeFormatter
  };
}


function update(ui, state, opts) {
  ui.line.setData(parse(ui, state, opts));
  ui.screen.render();
}


function parse(ui, state, opts) {
  return map(group(state.values, 'x'), d => ({
    title: d.name,
    x: parseXValues(ui, map(d.values, 'x'), opts),
    y: map(d.values, 'y'),
    style: {line: ui.colors(d.name)}
  }));
}


function parseXValues(ui, values, opts) {
  return opts.time
    ? parseTimeValues(ui, values, opts)
    : values.map(toString);
}


function parseTimeValues(ui, values, opts) {
  return values
    .map(parseDate)
    .map(ui.timeFormatter(values));
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


function timeFormatter(values) {
  return (d, i) => {
    let v = timeDiff(d, i, values);
    if (v < 1) return ftime.start(d);
    else if (v < 1000) return ftime.milliseconds(d);
    else if (v < 1000 * 60) return ftime.seconds(d);
    else if (v < 1000 * 60 * 60) return ftime.minutes(d);
    else if (v < 1000 * 60 * 60 * 24) return ftime.hours(d);
    else return ftime.fallback(d);
  };
}


function timeDiff(d, i, values) {
  return i > 0
    ? +d - +values[i - 1]
    : 0;
}


exports.create = create;
exports.update = update;
exports.parse = parse;
