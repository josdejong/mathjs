'use strict';

var collection = require('../../type/collection');

function factory (type, config, load, typed) {
  var pow = load(require('./pow'));

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
  return typed('dotMultiply', {
    'any, any': function (x, y) {
      return collection.deepMap2(x, y, pow);
    }
  });
}

exports.type = 'function';
exports.name = 'dotPow';
exports.factory = factory;
