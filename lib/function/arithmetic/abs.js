'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5);                // returns Number 3.5
   *    math.abs(-4.2);               // returns Number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2]);  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            A number or matrix for which to get the absolute value
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Absolute value of `x`
   */
  var abs = typed('abs', {
    'number': Math.abs,

    'Complex': function (x) {
      return Math.sqrt(x.re * x.re + x.im * x.im);
    },

    'BigNumber': function (x) {
      return x.abs();
    },

    'Array | Matrix': function (coll) {
      return collection.deepMap(coll, abs);
    }
  });

  return abs;
};
