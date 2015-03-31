'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));
  var divideScalar = load(require('./divideScalar'));

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
  return typed('dotDivide', {
    'any, any': function (x, y) {
      return collection.deepMap2(x, y, divideScalar);
    }
  });
}

exports.name = 'dotDivide';
exports.factory = factory;
