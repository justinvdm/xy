'use strict';
let ui = require('./ui');
let defaults = require('./defaults');
let { isNull, get, map, each, conj, castArray, groupBy } = require('./utils');


function xy(opts) {
  opts = parseOpts(opts);
  let ui = opts.ui.create(opts);
  let state = createState();

  return function next(chunk) {
    update(state, chunk, opts);
    opts.ui.update(ui, serialize(state), opts);
  };
}


function parseOpts(opts) {
  opts = conj(defaults(), opts || {});
  opts.ui = opts.ui || ui;
  return opts;
}


function createState() {
  return {sets: new Map()};
}


function update(state, chunk, opts) {
  chunk = parseChunk(chunk, opts);
  chunk = groupBy(chunk, 'key');
  each(chunk, (values, k) => setPush(state.sets, k, values, opts));
}


function serialize(state) {
  return {
    sets: Array.from(state.sets)
      .map(([key, values]) => ({
        key,
        values: map(values, serializeValue)
      }))
  };
}


function serializeValue({x, y}) {
  return {x, y};
}


function setPush(sets, k, values, opts) {
  sets.set(k, setGet(sets, k)
    .concat(values)
    .slice(-opts.n));
}


function setGet(sets, k) {
  return sets.has(k)
    ? sets.get(k)
    : [];
}


function parseChunk(chunk, opts) {
  return castArray(chunk)
    .map(d => parseInput(d, opts));
}


function parseInput(d, opts) {
  return {
    x: d[opts.x],
    y: d[opts.y],
    key: !isNull(opts.key)
      ? get(d, opts.key, '__default')
      : '__default'
  };
}


xy.update = update;
xy.parseOpts = parseOpts;
module.exports = xy;
