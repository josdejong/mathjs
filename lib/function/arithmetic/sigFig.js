
module.exports = function (math) {
  var util = require('../../util/index'),

    BigNumber = math.type.BigNumber,
    Complex = require('../../type/Complex'),
    collection = require('../../type/collection'),

    isNumber = util.number.isNumber,
    isInteger = util.number.isInteger,
    isBoolean = util['boolean'].isBoolean,
    isComplex = Complex.isComplex,
    isCollection = collection.isCollection,

    log10 = math.log10,
    floor = math.floor,
    abs = math.abs;

  /**
   * Round a value to a fixed number of significant figures
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sigFig(x, n)
   *
   * Examples:
   *
   *    math.sigFig(math.pi, 3);       // returns Number 3.14
   *    math.sigFig(123.45678, 2);     // returns Number 120
   *
   *    var c = math.complex(3.2, -0.27, 1);
   *    math.sigFig(c);                // returns Complex 3 - 0.3i
   *
   *    math.sigFig([3.2, 38, -0.47], 1); // returns Array [3, 30, -0.5]
   *
   * See also:
   *
   *    fix, round
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x   Number to be rounded
   * @param  {Number | BigNumber } n                 Number of significant figures
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  math.sigFig = function round(x, n) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('sigFig', arguments.length, 2);
    }

    if (!isNumber(n) || !isInteger(n)) {
      if (n instanceof BigNumber) {
        n = parseFloat(n.valueOf());
      } else {
        throw new TypeError('Number of decimals in function sigFig must be an integer');
      }
    }
    if (n < 1 || n > 15) {
      throw new Error ('Number of decimals in function sigFig must be in the range of 1-15');
    }

    if (isBoolean(x)) {
      return Math.round(x);
    }

    if (isNumber(x)) {
      return sigFigCalculator(x, n);
    }

    if (isComplex(x)) {
      return new Complex (
        sigFigCalculator(x.re, n),
        sigFigCalculator(x.im, n)
      );
    }

    throw new math.error.UnsupportedTypeError('sigFig', math['typeof'](x), math['typeof'](n));
  };

  var firstInsignificantFigure = function(x, n) {
    var firstSignificantDigit = floor(log10(abs(x))) + 1;
    return firstSignificantDigit - n;
  };

  var sigFigCalculator = function(x, n) {
    var p = Math.pow(10, firstInsignificantFigure(x, n));

    return Math.round((x / p)) * p;
  }

};