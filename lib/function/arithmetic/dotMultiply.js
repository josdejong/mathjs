'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var multiply = require('./multiply')(config);

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
  return typed('dotMultiply', {
    'any, any': function (x, y) {
      return collection.deepMap2(x, y, multiply);
    }
  });
};
