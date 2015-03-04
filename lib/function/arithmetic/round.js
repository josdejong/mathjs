'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

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
  math.round = function round(x, n) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new math.error.ArgumentsError('round', arguments.length, 1, 2);
    }

    if (n == undefined) {
      // round (x)
      if (isNumber(x)) {
        return Math.round(x);
      }

      if (isComplex(x)) {
        return new Complex (
            Math.round(x.re),
            Math.round(x.im)
        );
      }

      if (x instanceof BigNumber) {
        return x.toDecimalPlaces(0);
      }

      if (isCollection(x)) {
        return collection.deepMap(x, round);
      }

      if (isBoolean(x) || x === null) {
        return Math.round(x);
      }

      throw new math.error.UnsupportedTypeError('round', math['typeof'](x));
    }
    else {
      // round (x, n)
      if (!isNumber(n) || !isInteger(n)) {
        if (n instanceof BigNumber) {
          n = parseFloat(n.valueOf());
        }
        else if (isBoolean(n) || x === null) {
          return round(x, +n);
        }
        else {
          throw new TypeError('Number of decimals in function round must be an integer');
        }
      }
      if (n < 0 || n > 15) {
        throw new Error ('Number of decimals in function round must be in te range of 0-15');
      }

      if (isNumber(x)) {
        return roundNumber(x, n);
      }

      if (isComplex(x)) {
        return new Complex (
            roundNumber(x.re, n),
            roundNumber(x.im, n)
        );
      }

      if (x instanceof BigNumber) {
        return x.toDecimalPlaces(n);
      }

      if (isCollection(x) || isCollection(n)) {
        return collection.deepMap2(x, n, round);
      }

      if (isBoolean(x) || x === null) {
        return round(+x, n);
      }

      throw new math.error.UnsupportedTypeError('round', math['typeof'](x), math['typeof'](n));
    }
  };

  /**
   * round a number to the given number of decimals, or to zero if decimals is
   * not provided
   * @param {Number} value
   * @param {Number} decimals       number of decimals, between 0 and 15 (0 by default)
   * @return {Number} roundedValue
   */
  function roundNumber (value, decimals) {
    var p = Math.pow(10, decimals);
    return Math.round(value * p) / p;
  }
};
