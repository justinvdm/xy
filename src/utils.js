'use strict';
let _ = require('lodash');
let es = require('event-stream');
let get = _.get;
let keys = _.keys;
let streamEach = es.map;


function conj() {
  return _.extend({}, ...arguments);
}


function streamFilter(fn) {
  return streamEach((v, next) => fn(v)
    ? next(null, v)
    : next());
}


function group(values, xName) {
  return _(values)
    .map(keys)
    .flatten()
    .uniq()
    .reject(name => name === xName)
    .map(name => ({
      name: name,
      values: getValues(values, name)
    }))
    .value();

  function getValues(values, name) {
    return values
      .map(d => ({
        x: d[xName],
        y: get(d, name, null)
      }));
  }
}


module.exports = _.mixin({
  conj,
  streamFilter,
  group
});
