const assert = require('assert');
const ui = require('../src/ui');
const { map, noop } = require('../src/utils');
const { parseOpts } = require('../src');


describe("ui", () => {
  describe("parse", () => {
    it("should parse the given state into something blessed understands",
    () => {
      let i = 0;

      const uiState = {
        colors: () => i++
      };

      const res = ui.parse(uiState, {
        sets: [{
          key: 'y1',
          values: [{
            x: 21,
            y: 2
          }, {
            x: 25,
            y: 8
          }, {
            x: 30,
            y: 16
          }]
        }, {
          key: 'y2',
          values: [{
            x: 21,
            y: 3
          }, {
            x: 23,
            y: 6
          }, {
            x: 30,
            y: 24
          }]
        }]
      }, parseOpts(null));

      assert.deepEqual(res, [{
        x: [21, 25, 30],
        y: [2, 8, 16],
        style: {line: 0}
      }, {
        x: [21, 23, 30],
        y: [3, 6, 24],
        style: {line: 1}
      }]);
    });
  });
});
