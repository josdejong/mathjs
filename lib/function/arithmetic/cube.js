'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var multiply = require('./multiply')(config);
  var multiplyComplex = multiply.signatures['Complex,Complex'];

  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2);            // returns Number 8
   *    math.pow(2, 3);          // returns Number 8
   *    math.cube(4);            // returns Number 64
   *    4 * 4 * 4;               // returns Number 64
   *
   *    math.cube([1, 2, 3, 4]); // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number for which to calculate the cube
   * @return {Number | BigNumber | Complex | Array | Matrix} Cube of x
   */
  var cube = typed('cube', {
    'number': function (x) {
      return x * x * x;
    },

    'Complex': function (x) {
      return multiplyComplex(multiplyComplex(x, x), x);
    },

    'BigNumber': function (x) {
      return x.times(x).times(x);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, cube);
    }
  });

  return cube;
};
