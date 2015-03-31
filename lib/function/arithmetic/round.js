'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.2);              // returns Number 3
   *    math.round(3.8);              // returns Number 4
   *    math.round(-4.2);             // returns Number -4
   *    math.round(-4.7);             // returns Number -5
   *    math.round(math.pi, 3);       // returns Number 3.142
   *    math.round(123.45678, 2);     // returns Number 123.46
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.round(c);                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]); // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Number to be rounded
   * @param  {Number | BigNumber | Boolean | Array | null} [n=0]                 Number of decimals
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  var round = typed('round', {
    'number': Math.round,

    'number, number': function (x, n) {
      if (!isInteger(n))   {throw new TypeError('Number of decimals in function round must be an integer');}
      if (n < 0 || n > 15) {throw new Error('Number of decimals in function round must be in te range of 0-15');}

      return _round(x, n);
    },

    'Complex': function (x) {
      return new type.Complex (
          Math.round(x.re),
          Math.round(x.im)
      );
    },

    'Complex, number': function (x, n) {
      return new type.Complex (
          _round(x.re, n),
          _round(x.im, n)
      );
    },

    'Complex, BigNumber': function (x, n) {
      var _n = n.toNumber();
      return new type.Complex (
          _round(x.re, _n),
          _round(x.im, _n)
      );
    },

    'BigNumber': function (x) {
      return x.toDecimalPlaces(0);
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) {throw new TypeError('Number of decimals in function round must be an integer');}

      return x.toDecimalPlaces(n.toNumber());
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, round);
    },

    'Array | Matrix, number | BigNumber': function (x, n) {
      return collection.deepMap2(x, n, round);
    },

    'number | Complex | BigNumber, Array | Matrix': function (x, n) {
      return collection.deepMap2(x, n, round);
    }
  });

  return round;
}

/**
 * round a number to the given number of decimals, or to zero if decimals is
 * not provided
 * @param {Number} value
 * @param {Number} decimals       number of decimals, between 0 and 15 (0 by default)
 * @return {Number} roundedValue
 * @private
 */
function _round (value, decimals) {
  var p = Math.pow(10, decimals);
  return Math.round(value * p) / p;
}

exports.name = 'round';
exports.factory = factory;
