'use strict';
let assert = require('assert');
let xy = require('../src');


describe("xy", () => {
  it("should draw each given datapoint", () => {
    let draws = [];

    let chart = xy({
      x: 't',
      ui: {
        create: () => ({}),
        update: (ui, state) => draws.push(state)
      }
    });

    chart({
      t: 21,
      y: 2,
      z: 3
    });

    chart({
      t: 23,
      y: 4,
      z: 6
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2,
        z: 3
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }]
    }]);

    chart({
      t: 25,
      y: 8,
      z: 12
    });

    chart({
      t: 30,
      y: 16,
      z: 24
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2,
        z: 3
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }, {
        x: 25,
        y: 8,
        z: 12
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }, {
        x: 25,
        y: 8,
        z: 12
      }, {
        x: 30,
        y: 16,
        z: 24
      }]
    }]);
  });

  it("should support culling old datapoints", () => {
    let draws = [];

    let chart = xy({
      x: 't',
      n: 3,
      ui: {
        create: () => ({}),
        update: (ui, state) => draws.push(state)
      }
    });

    chart({
      t: 21,
      y: 2,
      z: 3
    });

    chart({
      t: 23,
      y: 4,
      z: 6
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2,
        z: 3
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }]
    }]);

    chart({
      t: 25,
      y: 8,
      z: 12
    });

    chart({
      t: 30,
      y: 16,
      z: 24
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2,
        z: 3
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }]
    }, {
      values: [{
        x: 21,
        y: 2,
        z: 3
      }, {
        x: 23,
        y: 4,
        z: 6
      }, {
        x: 25,
        y: 8,
        z: 12
      }]
    }, {
      values: [{
        x: 23,
        y: 4,
        z: 6
      }, {
        x: 25,
        y: 8,
        z: 12
      }, {
        x: 30,
        y: 16,
        z: 24
      }]
    }]);
  });
});

