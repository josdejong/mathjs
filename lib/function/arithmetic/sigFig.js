
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
   *    math.round(math.pi, 3);       // returns Number 3.14
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
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x   Number to be rounded
   * @param  {Number | BigNumber | Boolean | Array} [n=0]                 Number of decimals
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  math.sigFig = function round(x, n) {
    var p = Math.pow(10, firstInsignificantFigure(x, n));

    return Math.round((x / p)) * p;
  }

  var firstInsignificantFigure = function(x, n) {
    var firstSignificantDigit = floor(log10(abs(x))) + 1;
    return firstSignificantDigit - n;
  };

};