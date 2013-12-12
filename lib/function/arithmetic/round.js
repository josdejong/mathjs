module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards the nearest integer
   *
   *     round(x)
   *     round(x, n)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Array} [n] number of decimals (by default n=0)
   * @return {Number | BigNumber | Complex | Array | Matrix} res
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
        return x.round();
      }

      if (isCollection(x)) {
        return collection.deepMap(x, round);
      }

      if (isBoolean(x)) {
        return Math.round(x);
      }

      throw new math.error.UnsupportedTypeError('round', x);
    }
    else {
      // round (x, n)
      if (n instanceof BigNumber) {
        n = parseFloat(n.valueOf());
      }

      if (!isNumber(n) || !isInteger(n)) {
        throw new TypeError('Number of decimals in function round must be an integer');
      }
      if (n < 0 || n > 9) {
        throw new Error ('Number of decimals in function round must be in te range of 0-9');
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
        if (isNumber(n)) {
          return x.round(n);
        }
      }

      if (isCollection(x) || isCollection(n)) {
        return collection.deepMap2(x, n, round);
      }

      if (isBoolean(x)) {
        return round(+x, n);
      }
      if (isBoolean(n)) {
        return round(x, +n);
      }

      throw new math.error.UnsupportedTypeError('round', x, n);
    }
  };

  /**
   * round a number to the given number of decimals, or to zero if decimals is
   * not provided
   * @param {Number} value
   * @param {Number} [decimals]  number of decimals, between 0 and 15 (0 by default)
   * @return {Number} roundedValue
   */
  function roundNumber (value, decimals) {
    if (decimals) {
      var p = Math.pow(10, decimals);
      return Math.round(value * p) / p;
    }
    else {
      return Math.round(value);
    }
  }
};
