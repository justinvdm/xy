'use strict';
let ui = require('./ui');
let defaults = require('./defaults');
let { conj, castArray } = require('./utils');


function xy(opts) {
  opts = parseOpts(opts);
  let ui = opts.ui.create(opts);
  let state = createState();

  return function next(chunk) {
    state = update(state, parseChunk(chunk, opts), opts);
    opts.ui.update(ui, state, opts);
  };
}


function parseOpts(opts) {
  opts = conj(defaults(), opts || {});
  opts.ui = opts.ui || ui;
  return opts;
}


function createState() {
  return {
    values: []
  };
}


function update(state, chunk, opts) {
  return conj(state, {
    values: state.values
      .concat(chunk)
      .slice(-opts.n)
  });
}


function parseChunk(chunk, opts) {
  return castArray(chunk)
    .map(d => parseInput(d, opts));
}


function parseInput(d, opts) {
  return {
    x: d[opts.x],
    y: d[opts.y]
  };
}


xy.update = update;
xy.parseOpts = parseOpts;
module.exports = xy;
