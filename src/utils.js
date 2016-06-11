'use strict';
const _ = require('lodash');
const es = require('event-stream');
const { extend } = _;


function conj(...args) {
  return extend({}, ...args);
}


function parseDate(v) {
  return new Date(v);
}


module.exports = _.mixin({
  conj,
  parseDate
});
