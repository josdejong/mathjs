'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var divideScalar = load(require('./divideScalar'));
  var latex = require('../../utils/latex');
  
  var algorithm02 = load(require('../../type/matrix/utils/algorithm02'));
  var algorithm03 = load(require('../../type/matrix/utils/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/utils/algorithm07'));
  var algorithm11 = load(require('../../type/matrix/utils/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/utils/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));

  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotDivide(x, y)
   *
   * Examples:
   *
   *    math.dotDivide(2, 4);   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotDivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b);      // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, dotMultiply
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x Numerator
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
   */
  var dotDivide = typed('dotDivide', {
    
    'any, any': divideScalar,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm07(x, y, divideScalar, false);
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, divideScalar, true);
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm03(x, y, divideScalar, false);
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, divideScalar);
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(x, matrix(y));
    },

    'SparseMatrix, any': function (x, y) {
      return algorithm11(x, y, divideScalar, false);
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, divideScalar, false);
    },

    'any, SparseMatrix': function (x, y) {
      return algorithm12(y, x, divideScalar, true);
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, divideScalar, true);
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, divideScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, divideScalar, true).valueOf();
    }
  });

  dotDivide.toTex = {
    2: '\\left(${args[0]}' + latex.operators['dotDivide'] + '${args[1]}\\right)'
  };
  
  return dotDivide;
}

exports.name = 'dotDivide';
exports.factory = factory;
