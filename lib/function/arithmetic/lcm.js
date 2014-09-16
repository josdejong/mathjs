'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

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
  math.lcm = function lcm(args) {
    var a = arguments[0],
        b = arguments[1],
        t;

    if (arguments.length == 2) {
      // two arguments
      if (isNumber(a) && isNumber(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function lcm must be integer numbers');
        }

        if (a == 0 || b == 0) {
          return 0;
        }

        // http://en.wikipedia.org/wiki/Euclidean_algorithm
        // evaluate lcm here inline to reduce overhead
        var prod = a * b;
        while (b != 0) {
          t = b;
          b = a % t;
          a = t;
        }
        return Math.abs(prod / a);
      }

      // evaluate lcm element wise
      if (isCollection(a) || isCollection(b)) {
        return collection.deepMap2(a, b, lcm);
      }

      if (a instanceof BigNumber) {
        // try to convert to big number
        if (isNumber(b)) {
          b = BigNumber.convert(b);
        }
        else if (isBoolean(b) || b === null) {
          b = new BigNumber(b ? 1 : 0);
        }

        if (b instanceof BigNumber) {
          return _bigLcm(a, b);
        }

        // downgrade to Number
        return lcm(a.toNumber(), b);
      }
      if (b instanceof BigNumber) {
        // try to convert to big number
        if (isNumber(a)) {
          a = BigNumber.convert(a);
        }
        else if (isBoolean(a) || a === null) {
          a = new BigNumber(a ? 1 : 0);
        }

        if (a instanceof BigNumber) {
          return _bigLcm(a, b);
        }

        // downgrade to Number
        return lcm(a.toNumber(), b);
      }

      if (isBoolean(a) || a === null) {
        return lcm(+a, b);
      }
      if (isBoolean(b) || b === null) {
        return lcm(a, +b);
      }

      throw new math.error.UnsupportedTypeError('lcm', math['typeof'](a), math['typeof'](b));
    }

    if (arguments.length > 2) {
      // multiple arguments. Evaluate them iteratively
      for (var i = 1; i < arguments.length; i++) {
        a = lcm(a, arguments[i]);
      }
      return a;
    }

    // zero or one argument
    throw new SyntaxError('Function lcm expects two or more arguments');
  };

  /**
   * Calculate lcm for BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @returns {BigNumber} the least common multiple of a and b
   * @private
   */
  function _bigLcm(a, b) {
    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function lcm must be integer numbers');
    }

    if (a.isZero() || b.isZero()) {
      return new BigNumber(0);
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
};
