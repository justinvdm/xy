#!/usr/bin/env node

const cli = require('yargs')
const xy = require('./index')
const defaults = require('./defaults')()
const concat = require('concat-stream')
const { mapSync: map } = require('event-stream')
const { parse } = require('ldjson-stream')
const throttle = require('chunk-brake')

const args = cli
  .usage('Usage: $0 [options]')
  .help('help')
  .option('n', {
    default: defaults.n,
    describe: 'displays the last n datapoints'
  })
  .option('slurp', {
    alias: 's',
    type: 'boolean',
    describe: 'read the entire input stream and draw just once'
  })
  .option('color', {
    alias: 'c',
    default: defaults.color,
    describe: 'css color string to use for each set'
  })
  .option('set', {
    alias: 'S',
    default: defaults.set,
    describe: 'declare a set by its key to match it to a color'
  })
  .option('time', {
    alias: 't',
    type: 'boolean',
    describe: 'format x values from unix epoch milliseconds to date strings'
  })
  .option('time-format', {
    alias: 'T',
    type: 'string',
    describe: 'strftime format to use to format x values, implies --time'
  })
  .option('x', {
    default: defaults.x,
    describe: 'property name for x values'
  })
  .option('y', {
    default: defaults.y,
    describe: 'property name for y values'
  })
  .option('key', {
    alias: 'k',
    describe: 'property name to identify the set each datum belongs to'
  })
  .option('min', {
    alias: 'm',
    default: defaults.min,
    describe: 'minimum y value'
  })
  .option('max', {
    alias: 'M',
    default: defaults.max,
    describe: 'maximum y value'
  })
  .option('rate', {
    alias: 'r',
    default: defaults.rate,
    describe: 'number of new datapoints drawn per second'
  }).argv

if (args.timeFormat) args.time = true

function read() {
  let s = process.stdin.pipe(parse({ strict: false }))

  if (args.slurp) slurp(s)
  else stream(s)
}

function slurp(s) {
  s.pipe(concat(xy(args)))
}

function stream(s) {
  s.pipe(throttle(1000 / args.rate, { objectMode: true })).pipe(map(xy(args)))
}

setInterval(() => null, 99999)
read()
