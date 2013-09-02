module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isNumBool = util.number.isNumBool,
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
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @param {Number | Boolean | Array} [n] number of decimals (by default n=0)
   * @return {Number | Complex | Array | Matrix} res
   */
  math.round = function round(x, n) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('round', arguments.length, 1, 2);
    }

    if (n == undefined) {
      // round (x)
      if (isNumBool(x)) {
        return Math.round(x);
      }

      if (isComplex(x)) {
        return new Complex (
            Math.round(x.re),
            Math.round(x.im)
        );
      }

      if (isCollection(x)) {
        return collection.map(x, round);
      }

      if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return round(x.valueOf());
      }

      throw new util.error.UnsupportedTypeError('round', x);
    }
    else {
      // round (x, n)
      if (!isNumber(n) || !isInteger(n)) {
        throw new TypeError('Number of decimals in function round must be an integer');
      }
      if (n < 0 || n > 9) {
        throw new Error ('Number of decimals in function round must be in te range of 0-9');
      }

      if (isNumBool(x)) {
        return roundNumber(x, n);
      }

      if (isComplex(x)) {
        return new Complex (
            roundNumber(x.re, n),
            roundNumber(x.im, n)
        );
      }

      if (isCollection(x) || isCollection(n)) {
        return collection.map2(x, n, round);
      }

      if (x.valueOf() !== x || n.valueOf() !== n) {
        // fallback on the objects primitive values
        return round(x.valueOf(), n.valueOf());
      }

      throw new util.error.UnsupportedTypeError('round', x, n);
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
