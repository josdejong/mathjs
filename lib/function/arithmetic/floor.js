'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Round a value towards minus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.floor(x)
   *
   * Examples:
   *
   *    math.floor(3.2);              // returns Number 3
   *    math.floor(3.8);              // returns Number 3
   *    math.floor(-4.2);             // returns Number -5
   *    math.floor(-4.7);             // returns Number -5
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.floor(c);                // returns Complex 3 - 3i
   *
   *    math.floor([3.2, 3.8, -4.7]); // returns Array [3, 3, -5]
   *
   * See also:
   *
   *    ceil, fix, round
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number to be rounded
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  var floor = typed('floor', {
    'number': Math.floor,

    'Complex': function (x) {
      return new x.constructor(
          Math.floor(x.re),
          Math.floor(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.floor();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, floor);
    }
  });

  return floor;
};
