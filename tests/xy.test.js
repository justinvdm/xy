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
      y: 2
    });

    chart({
      t: 23,
      y: 4
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }]);

    chart({
      t: 25,
      y: 8
    });

    chart({
      t: 30,
      y: 16
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }, {
        x: 30,
        y: 16
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
      y: 2
    });

    chart({
      t: 23,
      y: 4
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }]);

    chart({
      t: 25,
      y: 8
    });

    chart({
      t: 30,
      y: 16
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }]
    }, {
      values: [{
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }, {
        x: 30,
        y: 16
      }]
    }]);
  });

  it("should allow chunks of data to be given", () => {
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
      y: 2
    });

    chart({
      t: 23,
      y: 4
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }]);

    chart({
      t: 25,
      y: 8
    });

    chart({
      t: 30,
      y: 16
    });

    assert.deepEqual(draws, [{
      values: [{
        x: 21,
        y: 2
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }]
    }, {
      values: [{
        x: 21,
        y: 2
      }, {
        x: 23,
        y: 4
      }, {
        x: 25,
        y: 8
      }, {
        x: 30,
        y: 16
      }]
    }]);
  });
});
