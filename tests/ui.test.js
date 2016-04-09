'use strict';
let assert = require('assert');
let ui = require('../src/ui');


describe("ui", () => {
  describe("parse", () => {
    it("should parse the given state into something blessed understands", () => {
      let i = 0;

      let res = ui.parse({colors: () => i++}, {
        values: [{
          x: 21,
          y: 2,
          z: 3
        }, {
          x: 23,
          z: 6
        }, {
          x: 25,
          y: 8,
        }, {
          x: 30,
          y: 16,
          z: 24
        }]
      });

      assert.deepEqual(res, [{
        title: 'y',
        x: [21, 23, 25, 30],
        y: [2, null, 8, 16],
        style: {line: 0}
      }, {
        title: 'z',
        x: [21, 23, 25, 30],
        y: [3, 6, null, 24],
        style: {line: 1}
      }]);
    });
  });
});
