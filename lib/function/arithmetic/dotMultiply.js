'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),
      collection = math.collection;

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4); // returns 8
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotMultiply(a, b); // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b);    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Left hand value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Right hand value
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */
  math.dotMultiply = function dotMultiply(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('dotMultiply', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.multiply);
  };

  // TODO: deprecated since version 0.23.0, clean up some day
  math.emultiply = function () {
    throw new Error('Function emultiply is renamed to dotMultiply');
  }
};
