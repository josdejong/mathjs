'use strict';

function factory(type, config, load, typed) {
  var latex    = require('../../utils/latex');
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
   *     sqrt, pow, abs, max
   *
   * @param  {Matrix} A   The square matrix `A`
   * @return {Matrix}     The principal square root of matrix `A`
   */
  var sqrtm = typed('sqrtm', {
    'Matrix | Matrix': function (A) {
      var size = A.size();
      switch (size.length) {
        case 1:
          // vector
          if (size[0] == 1) {
            return matrix([
              sqrt(A.valueOf()[0])
            ]);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }

        case 2:
          // two dimensional array
          var rows = size[0];
          var cols = size[1];
          if (rows == cols) {
            // return _babylonianMethod(A);
            return _denmanBeavers(A);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
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
   * @param  {Matrix} A   The square matrix `A`
   * @return {Matrix}     The principal square root of matrix `A`
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
        throw new SyntaxError('Could not converge to solution within the maximum iterations limit');
      }
    } while (error > _tolerance);

    return Y;
  }

  /**
   * Calculate the principal square root matrix using the Babylonian iterative method
   * 
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_the_Babylonian_method
   * 
   * @param  {Matrix} A   The square matrix `A`
   * @return {Matrix}     The principal square root of matrix `A`
   * @private
   */
  function _babylonianMethod(A) {
    var error;
    var iterations = 0;

    var X = eye(size(A));

    do {
      var X_k = X;
      X = multiply(0.5, add(X, divide(A, X)));

      error = max(abs(subtract(X, X_k)));

      if (error > _tolerance && ++iterations > _maxIterations) {
        throw new SyntaxError('Could not converge to solution within the maximum iterations limit');
      }
    } while (error > _tolerance);

    return X;
  }

  sqrtm.toTex = {1: '\\left(${args[0]}\\right)' + latex.operators['pow'] + '{\\frac{1}{2}}'};

  return sqrtm;
}

exports.name = 'sqrtm';
exports.factory = factory;
