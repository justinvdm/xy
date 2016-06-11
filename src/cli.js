#!/usr/bin/env node
'use strict';

let cli = require('yargs');
let _ = require('./utils');
let xy = require('./index');
let defaults = require('./defaults')();
let es = require('event-stream');
let concat = require('concat-stream');
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
  .option('slurp', {
    alias: 's',
    type: 'boolean',
    describe: 'Read the entire input stream and draw just once'
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
  .option('y', {
    default: defaults.y,
    describe: `Property name for y values`
  })
  .option('key', {
    alias: 'k',
    describe: `Property name to identify the set this datum belongs to`
  })
  .option('min', {
    alias: 'm',
    default: defaults.min,
    describe: `Minimum y value`
  })
  .option('max', {
    alias: 'M',
    default: defaults.max,
    describe: `Maximum y value`
  })
  .argv;


  process.stdin
    .pipe(parse({strict: false}))
    .pipe(args.slurp
      ? concat(xy(args))
      : map(xy(args)))


setInterval(noop, Math.POSITIVE_INFINITY);
