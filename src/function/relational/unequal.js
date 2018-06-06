'use strict';

var nearlyEqual = require('../../utils/number').nearlyEqual;
var bigNearlyEqual = require('../../utils/bignumber/nearlyEqual');

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));

  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  var latex = require('../../utils/latex');

  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   * Strings are compared by their numerical value.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everything
   * except `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3);       // returns true
   *    math.unequal(2 + 2, 4);       // returns false
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.unequal(a, b);           // returns false
   *
   *    var c = [2, 5, 1];
   *    var d = [2, 7, 1];
   *
   *    math.unequal(c, d);           // returns [false, true, false]
   *    math.deepEqual(c, d);         // returns false
   *
   *    math.unequal(0, null);        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */
  var unequal = typed('unequal', {
    
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y !== null; }
      if (y === null) { return x !== null; }
      if (x === undefined) { return y !== undefined; }
      if (y === undefined) { return x !== undefined; }

      return _unequal(x, y);
    },

    'SparseMatrix, SparseMatrix': function(x, y) {
      return algorithm07(x, y, _unequal);
    },

    'SparseMatrix, DenseMatrix': function(x, y) {
      return algorithm03(y, x, _unequal, true);
    },

    'DenseMatrix, SparseMatrix': function(x, y) {
      return algorithm03(x, y, _unequal, false);
    },

    'DenseMatrix, DenseMatrix': function(x, y) {
      return algorithm13(x, y, _unequal);
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return unequal(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return unequal(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return unequal(x, matrix(y));
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm12(x, y, _unequal, false);
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, _unequal, false);
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, _unequal, true);
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, _unequal, true);
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _unequal, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _unequal, true).valueOf();
    }
  });

  var _unequal = typed('_unequal', {

    'boolean, boolean': function (x, y) {
      return x !== y;
    },

    'number, number': function (x, y) {
      return !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return !bigNearlyEqual(x, y, config.epsilon);
    },

    'Fraction, Fraction': function (x, y) {
      return !x.equals(y);
    },

    'Complex, Complex': function (x, y) {
      return !x.equals(y);
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return unequal(x.value, y.value);
    }
  });

  unequal.toTex = {
    2: '\\left(${args[0]}' + latex.operators['unequal'] + '${args[1]}\\right)'
  };

  return unequal;
}

exports.name = 'unequal';
exports.factory = factory;
