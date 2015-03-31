'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gcd(a, b)
   *    math.gcd(a, b, c, ...)
   *
   * Examples:
   *
   *    math.gcd(8, 12);              // returns 4
   *    math.gcd(-4, 6);              // returns 2
   *    math.gcd(25, 15, -10);        // returns 5
   *
   *    math.gcd([8, -4], [12, 6]);   // returns [4, 2]
   *
   * See also:
   *
   *    lcm, xgcd
   *
   * @param {... Number | BigNumber | Boolean | Array | Matrix | null} args  Two or more integer numbers
   * @return {Number | BigNumber | Array | Matrix}                           The greatest common divisor
   */
  var gcd = typed('gcd', {
    'number, number': _gcd,

    'BigNumber, BigNumber': _gcdBigNumber,

    'Array | Matrix, Array | Matrix | number | BigNumber': function (a, b) {
      return collection.deepMap2(a, b, gcd);
    },

    'number | BigNumber, Array | Matrix': function (a, b) {
      return collection.deepMap2(a, b, gcd);
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      var res = gcd(a, b);
      for (var i = 0; i < args.length; i++) {
        res = gcd(res, args[i]);
      }
      return res;
    }
  });

  return gcd;

  /**
   * Calculate gcd for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns greatest common denominator of a and b
   * @private
   */
  function _gcdBigNumber(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function gcd must be integer numbers');
    }

    // http://en.wikipedia.org/wiki/Euclidean_algorithm
    var zero = new type.BigNumber(0);
    while (!b.isZero()) {
      var r = a.mod(b);
      a = b;
      b = r;
    }
    return a.lt(zero) ? a.neg() : a;
  }
}

/**
 * Calculate gcd for numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the greatest common denominator of a and b
 * @private
 */
function _gcd(a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error('Parameters in function gcd must be integer numbers');
  }

  // http://en.wikipedia.org/wiki/Euclidean_algorithm
  var r;
  while (b != 0) {
    r = a % b;
    a = b;
    b = r;
  }
  return (a < 0) ? -a : a;
}

exports.name = 'gcd';
exports.factory = factory;