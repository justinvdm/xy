'use strict';
let assert = require('assert');
let ui = require('../src/ui');
let map = require('../src/utils').map;
let parseOpts = require('../src').parseOpts;


describe("ui", () => {
  describe("parse", () => {
    it("should parse the given state into something blessed understands", () => {
      let i = 0;

      let uiState = {
        colors: () => i++
      };

      let res = ui.parse(uiState, {
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
      }, parseOpts(null));

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

    it("should support time formatting", () => {
      let i = 0;

      let uiState = {
        colors: () => i++,
        timeFormatter: () => x => `t${+x}`
      };

      let res = ui.parse(uiState, {
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
      }, parseOpts({time: true}));

      assert.deepEqual(map(res, 'x'), [
        ['t21', 't23', 't25', 't30'],
        ['t21', 't23', 't25', 't30']
      ]);
    });
  });
});
