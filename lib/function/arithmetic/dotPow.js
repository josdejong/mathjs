'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),
      collection = math.collection;

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.dotPow(x, y)
   *
   * Examples:
   *
   *    math.dotPow(2, 3);            // returns Number 8
   *
   *    var a = [[1, 2], [4, 3]];
   *    math.dotPow(a, 2);            // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2);               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  The base
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y  The exponent
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
   */
  math.dotPow = function dotPow(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('dotPow', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.pow);
  };

  // TODO: deprecated since version 0.23.0, clean up some day
  math.epow = function () {
    throw new Error('Function epow is renamed to dotPow');
  }
};
