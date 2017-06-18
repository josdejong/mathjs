'use strict';

var compareString = require('natural-compare');

function factory (type, config, load, typed) {

  var compare = load(require('./compare'));

  /**
   * Compare two values in a natural way.
   *
   * For numeric values, the function works the same as `math.compare`.
   * For types of values that can't be compared mathematically,
   * the function compares in a natural way.
   *
   * For numeric values, x and y are considered equal when the relative
   * difference between x and y is smaller than the configured epsilon.
   * The function cannot be used to compare values smaller than
   * approximately 2.22e-16.
   *
   * For Complex numbers, first the real parts are compared. If equal,
   * the imaginary parts are compared.
   *
   * Syntax:
   *
   *    math.compareNatural(x, y)
   *
   * Examples:
   *
   *    math.compareNatural(6, 1);           // returns 1
   *    math.compareNatural(2, 3);           // returns -1
   *    math.compareNatural(7, 7);           // returns 0
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.compareNatural(a, b);           // returns 1
   *
   *    var c = math.complex('2 + 3i');
   *    var d = math.complex('2 + 4i');
   *    math.compareNatural(c, d);           // returns -1
   *
   *    math.compareNatural(2, [1, 2, 3]);   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | Unit | string} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string} y Second value to compare
   * @return {number | BigNumber} Returns the result of the comparison: 1, 0 or -1.
   */
  var compareNatural = typed('compareNatural', {

    'boolean, boolean': compare.signatures['boolean,boolean'],

    'number, number': compare.signatures['number,number'],

    'BigNumber, BigNumber': compare.signatures['BigNumber,BigNumber'],

    'Fraction, Fraction': compare.signatures['Fraction,Fraction'],

    'Complex, Complex': compareComplex,

    'Unit, Unit': compare.signatures['Unit,Unit'],

    'string, string': compareString

    // TODO: implement for Matrix. element-wise or whole matrix?
    // TODO: implement for Array. element-wise or whole matrix?
    // TODO: implement for Object. element-wise or whole object?
  });

  compare.toTex = undefined; // use default template

  return compareNatural;
}

/**
 * Compare two complex numbers, `a` and `b`:
 *
 * - Returns 1 when the real part of `a` is larger than the real part of `b`
 * - Returns -1 when the real part of `a` is smaller than the real part of `b`
 * - Returns 1 when the real parts are equal
 *   and the imaginary part of `a` is larger than the imaginary part of `b`
 * - Returns -1 when the real parts are equal
 *   and the imaginary part of `a` is smaller than the imaginary part of `b`
 * - Returns 0 when both real and imaginary parts are equal.
 *
 * @params {Complex} a
 * @params {Complex} b
 * @returns {number} Returns the comparison result: -1, 0, or 1
 */
function compareComplex (a, b) {
  if (a.re > b.re) { return 1; }
  if (a.re < b.re) { return -1; }

  if (a.im > b.im) { return 1; }
  if (a.im < b.im) { return -1; }

  return 0;
}

exports.name = 'compareNatural';
exports.factory = factory;
