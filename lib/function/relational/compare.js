'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;
var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm05 = load(require('../../type/matrix/utils/algorithm05'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1);           // returns 1
   *    math.compare(2, 3);           // returns -1
   *    math.compare(7, 7);           // returns 0
   *    math.compare('10', '2');      // returns 1
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.compare(a, b);           // returns 1
   *
   *    math.compare(2, [1, 2, 3]);   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compareNatural
   *
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} y Second value to compare
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the result of the comparison: 1, 0 or -1.
   */
  var compare = typed('compare', {

    'boolean, boolean': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1);
    },

    'number, number': function (x, y) {
      return (x === y || nearlyEqual(x, y, config.epsilon))
          ? 0
          : (x > y ? 1 : -1);
    },

    'BigNumber, BigNumber': function (x, y) {
      return (x.eq(y) || bigNearlyEqual(x, y, config.epsilon))
          ? new type.BigNumber(0)
          : new type.BigNumber(x.cmp(y));
    },

    'Fraction, Fraction': function (x, y) {
      return new type.Fraction(x.compare(y));
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return compare(x.value, y.value);
    },

    'SparseMatrix, SparseMatrix': function(x, y) {
      return algorithm05(x, y, compare);
    },

    'SparseMatrix, DenseMatrix': function(x, y) {
      return algorithm03(y, x, compare, true);
    },

    'DenseMatrix, SparseMatrix': function(x, y) {
      return algorithm03(x, y, compare, false);
    },

    'DenseMatrix, DenseMatrix': function(x, y) {
      return algorithm13(x, y, compare);
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return compare(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return compare(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return compare(x, matrix(y));
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, compare, false);
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, compare, false);
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, compare, true);
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, compare, true);
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, compare, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, compare, true).valueOf();
    }
  });

  compare.toTex = undefined; // use default template

  return compare;
}

exports.name = 'compare';
exports.factory = factory;
