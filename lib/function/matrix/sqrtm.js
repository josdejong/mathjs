'use strict';

var array  = require('../../utils/array');
var latex  = require('../../utils/latex');
var string = require('../../utils/string');

function factory(type, config, load, typed) {
  var matrix   = load(require('../../type/matrix/function/matrix'));
  var abs      = load(require('../arithmetic/abs'));
  var add      = load(require('../arithmetic/add'));
  var divide   = load(require('../arithmetic/divide'));
  var multiply = load(require('../arithmetic/multiply'));
  var sqrt     = load(require('../arithmetic/sqrt'));
  var subtract = load(require('../arithmetic/subtract'));
  var inv      = load(require('../matrix/inv'));
  var size     = load(require('../matrix/size'));
  var max      = load(require('../statistics/max'));
  var eye      = load(require('./eye'));

  /**
   * Calculate the principal square root of a square matrix.
   * The principal square root matrix `X` of another matrix `A` is such that `X * X = A`.
   *
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix
   * 
   * Syntax:
   *
   *     X = math.sqrtm(A)
   *
   * Examples:
   *
   *     math.sqrtm([[1, 2], [3, 4]]); // returns [[-2, 1], [1.5, -0.5]]
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   */
  var sqrtm = typed('sqrtm', {
    'Array | Matrix': function (A) {
      var size = type.isMatrix(A) ? A.size() : array.size(A);
      switch (size.length) {
        case 1:
          // Single element Array | Matrix
          if (size[0] == 1) {
            return sqrt(A);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }

        case 2:
          // Two-dimensional Array | Matrix
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            return _denmanBeavers(A);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + string.format(size) + ')');
          }
      }
    }
  });

  var _maxIterations = 1e3;
  var _tolerance = 1e-6;

  /**
   * Calculate the principal square root matrix using the Denman–Beavers iterative method
   * 
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_Denman–Beavers_iteration
   * 
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   * @private
   */
  function _denmanBeavers(A) {
    var error;
    var iterations = 0;

    var Y = A;
    var Z = eye(size(A));

    do {
      var Y_k = Y;
      Y = multiply(0.5, add(Y_k, inv(Z)));
      Z = multiply(0.5, add(Z, inv(Y_k)));

      error = max(abs(subtract(Y, Y_k)));

      if (error > _tolerance && ++iterations > _maxIterations) {
        throw new Error('computing square root of matrix: iterative method could not converge');
      }
    } while (error > _tolerance);

    return Y;
  }

  sqrtm.toTex = {1: '{${args[0]}}' + latex.operators['pow'] + '{\\frac{1}{2}}'};

  return sqrtm;
}

exports.name = 'sqrtm';
exports.factory = factory;
