'use strict';

module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotDivide(x, y)
   *
   * Examples:
   *
   *    math.dotDivide(2, 4);   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotDivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b);      // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, dotMultiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Numerator
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Denominator
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
   */
  math.dotDivide = function dotDivide(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('dotDivide', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.divide);
  };

  // TODO: deprecated since version 0.23.0, clean up some day
  math.edivide = function () {
    throw new Error('Function edivide is renamed to dotDivide');
  }
};
