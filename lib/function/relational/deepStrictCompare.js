'use strict';

var isCollection = require('../../utils/collection/isCollection');

function factory (type, config, load, typed) {
  var getTypeOf = load(require('../utils/typeof'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var compare = load(require('./compare'));

  var compareBooleans = compare.signatures['boolean,boolean']
  var compareUnits = compare.signatures['Unit,Unit']
  var compareNumbers = compare.signatures['number,number']
  var compareBigNumbers = compare.signatures['BigNumber,BigNumber']
  var compareFractions = compare.signatures['Fraction,Fraction']

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
   *    math.deepStrictCompare(x, y)
   *
   * Examples:
   *
   *    math.deepStrictCompare(6, 1);              // returns 1
   *    math.deepStrictCompare(2, 3);              // returns -1
   *    math.deepStrictCompare(7, 7);              // returns 0
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.deepStrictCompare(a, b);              // returns 1
   *
   *    var c = math.complex('2 + 3i');
   *    var d = math.complex('2 + 4i');
   *    math.deepStrictCompare(c, d);              // returns -1
   *
   *    math.deepStrictCompare([1, 2, 3], [1, 2]); // returns 1
   *    math.deepStrictCompare([1, 2], [1, 2]);    // returns 0
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {*} x First value to compare
   * @param  {*} y Second value to compare
   * @return {number} Returns the result of the comparison: 1, 0 or -1.
   */
  var deepStrictCompare = typed('deepStrictCompare', {
    'any, any': function (x, y) {
      var typeX = getTypeOf(x);
      var typeY = getTypeOf(y);

      // in case of different types, order by name of type
      // i.e. 'BigNumber' < 'Complex'
      if (typeX !== typeY) {
        return compareString(typeX, typeY);
      }

      if (typeX === 'number') {
        return compareNumbers(x, y);
      }

      if (typeX === 'BigNumber') {
        return compareBigNumbers(x, y).toNumber();
      }

      if (typeX === 'Fraction') {
        return compareFractions(x, y);
      }

      if (typeX === 'Complex') {
        return compareComplexNumbers(x, y);
      }

      if (typeX === 'Unit') {
        // FIXME: implement ordering for units with different base
        return compareUnits(x, y);
      }

      if (typeX === 'boolean') {
        return compareBooleans(x, y);
      }

      if (typeX === 'string') {
        return compareString(x, y);
      }

      if (typeX === 'Matrix') {
        // can be SparseMatrix or DenseMatrix
        if (x.type !== y.type) {
          return compareString(x.type, y.type)
        }
        if (x.type === 'DenseMatrix') {
          return compareDenseMatrices(x, y);
        }
        if (x.type === 'SparseMatrix') {
          return compareSparseMatrices(x, y);
        }
      }

      if (typeX === 'Array') {
        return compareArrays(x, y);
      }

      if (typeX === 'Object') {
        return compareObjects(x, y);
      }

      if (typeX === 'null') {
        return 0;
      }

      if (typeX === 'undefined') {
        return 0;
      }

      // this should not occur...
      throw new TypeError('Unsupported type of value "' + typeX + '"');
    }
  });

  deepStrictCompare.toTex = undefined; // use default template

  /**
   * Compare two Arrays
   *
   * - First compares the length of the arrays
   * - Next, compares value by value
   *
   * @param {Array} a
   * @param {Array} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareArrays (a, b) {
    // compare the size of the arrays
    if (a.length > b.length) { return 1; }
    if (a.length < b.length) { return -1; }

    // compare each value
    for (var i = 0; i < a.length; i++) {
      var v = deepStrictCompare(a[i], b[i]);
      if (v !== 0) {
        return v;
      }
    }

    // both Arrays have equal size and content
    return 0;
  }

  /**
   * Compare two dense matrices
   *
   * - First compares the number of dimensions
   * - Next, compares the size of the dimensions
   * - Last, compares value by value
   *
   * @param {DenseMatrix} a
   * @param {DenseMatrix} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareDenseMatrices (a, b) {
    // get internal size and values without cloning anything
    var _a = a.toJSON();
    var _b = b.toJSON();

    // compare number and size of the dimensions
    var c = compareArrays(_a.size, _b.size);
    if (c !== 0) {
      return c;
    }

    // compare the values of the matrices
    return compareArrays(_a.data, _b.data);
  }

  /**
   * Compare two sparse matrices
   *
   * - First compares the number of dimensions
   * - Next, compares the size of the dimensions
   * - Last, compares value by value
   *
   * @param {SparseMatrix} a
   * @param {SparseMatrix} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareSparseMatrices (a, b) {
    // get internal size and values without cloning anything
    var _a = a.toJSON();
    var _b = b.toJSON();

    // compare number and size of the dimensions
    var c = compareArrays(_a.size, _b.size);
    if (c !== 0) {
      return c;
    }

    // compare the values of the matrices
    return compareArrays(_a.values, _b.values);
  }

  /**
   * Compare two objects
   * - First, compares the number of properties
   * - Then, compare the property names when sorted
   * - Lastly, compare the property values
   * @param {Object} a
   * @param {Object} b
   * @returns {number} Returns the comparison result: -1, 0, or 1
   */
  function compareObjects (a, b) {
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);

    // compare number of keys
    if (keysA.length > keysB.length) { return 1; }
    if (keysA.length < keysB.length) { return -1; }

    // compare keys
    keysA.sort(compareString)
    keysB.sort(compareString)
    var c = compareArrays(keysA, keysB);
    if (c !== 0) {
      return c;
    }

    // compare values
    for (var i = 0; i < keysA.length; i++) {
      var v = deepStrictCompare(a[keysA[i]], b[keysB[i]]);
      if (v !== 0) {
        return v;
      }
    }

    return 0;
  }

  return deepStrictCompare;
}

/**
 * Compare two strings by the char code of their characters
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
function compareString (a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
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
function compareComplexNumbers (a, b) {
  if (a.re > b.re) { return 1; }
  if (a.re < b.re) { return -1; }

  if (a.im > b.im) { return 1; }
  if (a.im < b.im) { return -1; }

  return 0;
}

exports.name = 'deepStrictCompare';
exports.factory = factory;
