'use strict';

var isInteger = require('../../utils/number').isInteger;
var bigLeftShift = require('../../utils/bignumber/leftShift');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  var matrix = load(require('../../type/matrix/function/matrix'));
  var equalScalar = load(require('../relational/equalScalar'));
  var zeros = load(require('../matrix/zeros'));

  var algorithm01 = load(require('../../type/matrix/utils/algorithm01'));
  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm08 = load(require('../../type/matrix/utils/algorithm08'));
  var algorithm10 = load(require('../../type/matrix/utils/algorithm10'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2);               // returns number 4
   *
   *    math.leftShift([1, 2, 3], 4);       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    leftShift, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x Value to be shifted
   * @param  {number | BigNumber} y Amount of shifts
   * @return {number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  var leftShift = typed('leftShift', {
    
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function leftShift');
      }

      return x << y;
    },

    'BigNumber, BigNumber': bigLeftShift,

    'SparseMatrix, SparseMatrix': function(x, y) {
      return algorithm08(x, y, leftShift, false);
    },

    'SparseMatrix, DenseMatrix': function(x, y) {
      return algorithm02(y, x, leftShift, true);
    },

    'DenseMatrix, SparseMatrix': function(x, y) {
      return algorithm01(x, y, leftShift, false);
    },

    'DenseMatrix, DenseMatrix': function(x, y) {
      return algorithm13(x, y, leftShift);
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return leftShift(x, matrix(y));
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone();
      }
      return algorithm11(x, y, leftShift, false);
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone();
      }
      return algorithm14(x, y, leftShift, false);
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage());
      }
      return algorithm10(y, x, leftShift, true);
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage());
      }
      return algorithm14(y, x, leftShift, true);
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), y).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return leftShift(x, matrix(y)).valueOf();
    }
  });

  leftShift.toTex = {
    2: '\\left(${args[0]}' + latex.operators['leftShift'] + '${args[1]}\\right)'
  };

  return leftShift;
}

exports.name = 'leftShift';
exports.factory = factory;
