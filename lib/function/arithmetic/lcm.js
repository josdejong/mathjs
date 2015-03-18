'use strict';

var collection = require('../../type/collection');
var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   * lcm is defined as:
   *
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.lcm(a, b)
   *    math.lcm(a, b, c, ...)
   *
   * Examples:
   *
   *    math.lcm(4, 6);               // returns 12
   *    math.lcm(6, 21);              // returns 42
   *    math.lcm(6, 21, 5);           // returns 210
   *
   *    math.lcm([4, 6], [6, 21]);    // returns [12, 42]
   *
   * See also:
   *
   *    gcd, xgcd
   *
   * @param {... Number | BigNumber | Boolean | Array | Matrix | null} args  Two or more integer numbers
   * @return {Number | BigNumber | Array | Matrix}                           The least common multiple
   */
  var lcm = typed('lcm', {
    'number, number': _lcm,

    'BigNumber, BigNumber': _lcmBigNumber,

    'Array | Matrix, Array | Matrix | number | BigNumber': function (a, b) {
      return collection.deepMap2(a, b, lcm);
    },

    'number | BigNumber, Array | Matrix': function (a, b) {
      return collection.deepMap2(a, b, lcm);
    },

    // TODO: need a smarter notation here
    'Array | Matrix | number | BigNumber, Array | Matrix | number | BigNumber, ...Array | Matrix | number | BigNumber': function (a, b, args) {
      var res = lcm(a, b);
      for (var i = 0; i < args.length; i++) {
        res = lcm(res, args[i]);
      }
      return res;
    }
  });

  return lcm;

  /**
   * Calculate lcm for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} Returns the least common multiple of a and b
   * @private
   */
  function _lcmBigNumber(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers');
    }

    if (a.isZero() || b.isZero()) {
      return new type.BigNumber(0);
    }

    // http://en.wikipedia.org/wiki/Euclidean_algorithm
    // evaluate lcm here inline to reduce overhead
    var prod = a.times(b);
    while (!b.isZero()) {
      var t = b;
      b = a.mod(t);
      a = t;
    }
    return prod.div(a).abs();
  }
}

/**
 * Calculate lcm for two numbers
 * @param {number} a
 * @param {number} b
 * @returns {number} Returns the least common multiple of a and b
 * @private
 */
function _lcm (a, b) {
  if (!isInteger(a) || !isInteger(b)) {
    throw new Error('Parameters in function lcm must be integer numbers');
  }

  if (a == 0 || b == 0) {
    return 0;
  }

  // http://en.wikipedia.org/wiki/Euclidean_algorithm
  // evaluate lcm here inline to reduce overhead
  var t;
  var prod = a * b;
  while (b != 0) {
    t = b;
    b = a % t;
    a = t;
  }
  return Math.abs(prod / a);
}

exports.type = 'function';
exports.name = 'lcm';
exports.factory = factory;