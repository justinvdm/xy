#!/usr/bin/env node
'use strict';

let cli = require('yargs');
let _ = require('./utils');
let xy = require('./index');
let defaults = require('./defaults')();
let es = require('event-stream');
let map = es.mapSync;
let noop = _.noop;
let toString = _.toString;


let args = cli
  .usage('Usage: $0 [options]')
  .help('help')
  .option('x', {
    default: 'x',
    describe: `Property name for timestamp values`
  })
  .argv;


process.stdin
  .pipe(map(parse))
  .pipe(map(xy(args)));


function parse(s) {
  return _(s.toString())
    .split('\n')
    .compact()
    .map(JSON.parse)
    .value();
}


setInterval(noop, Math.POSITIVE_INFINITY);
