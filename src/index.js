'use strict';
let _ = require('./utils');
let conj = _.conj;
let omit = _.omit;
let ui = require('./ui');
let defaults = require('./defaults');


function xy(opts) {
  opts = parseOpts(opts);
  let ui = opts.ui.create(opts);
  let state = createState();

  return function next(chunk) {
    chunk = chunk.map(parse);
    state = update(state, chunk);
    opts.ui.update(ui, state, opts);
  };


  function parse(d) {
    return parseInput(d, opts);
  }
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
    values: state.values.concat(chunk)
  });
}


function parseInput(d, opts) {
  return conj(omit(d, opts.x), {x: +d[opts.x]});
}


xy.update = update;
xy.parseOpts = parseOpts;
module.exports = xy;
