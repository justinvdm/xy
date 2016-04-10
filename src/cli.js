#!/usr/bin/env node
'use strict';

let cli = require('yargs');
let _ = require('./utils');
let xy = require('./index');
let defaults = require('./defaults')();
let es = require('event-stream');
let parse = require('ldjson-stream').parse;
let map = es.mapSync;
let noop = _.noop;


let args = cli
  .usage('Usage: $0 [options]')
  .help('help')
  .option('n', {
    defaults: defaults.n,
    describe: 'Displays the last n datapoints'
  })
  .option('time', {
    alias: 't',
    type: 'boolean',
    describe: `Format x axis values from unix epoch milliseconds to date strings`
  })
  .option('x', {
    default: defaults.x,
    describe: `Property name for x values`
  })
  .argv;


process.stdin
  .pipe(parse({strict: false}))
  .pipe(map(xy(args)));


setInterval(noop, Math.POSITIVE_INFINITY);
