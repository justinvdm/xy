'use strict';
let d3 = require('d3');
let _ = require('./utils');
let map = _.map;
let group = _.group;
let toString = _.toString;
let parseDate = _.parseDate;
let createScreen = require('blessed').screen;
let createLine = require('blessed-contrib').line;
let omitBy = require('lodash/omitBy');
let isNull = require('lodash/isNull');

const ftime = {
  start: d3.time.format('%y-%m-%d'),
  milliseconds: d3.time.format('.%L'),
  seconds: d3.time.format(':%S'),
  minutes: d3.time.format('%H:%M '),
  hours: d3.time.format('%I %p'),
  fallback: d3.time.format('%y-%m-%d')
};


function create(opts) {
  let screen = createScreen();

  let line = createLine(omitBy({
    showLegend: opts.showLegend,
    minY: opts.min,
    maxY: opts.max
  }, isNull));

  screen.append(line);

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  return {
    line,
    screen,
    timeFormatter,
    colors: (opts.colors || randomColors)()
  };
}


function update(ui, state, opts) {
  ui.line.setData(parse(ui, state, opts));
  ui.screen.render();
}


function parse(ui, state, opts) {
  return Array.from(state.sets)
    .map(({values, key}) => ({
      x: parseXValues(ui, map(values, 'x'), opts),
      y: map(values, 'y'),
      style: {line: ui.colors(key)}
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
