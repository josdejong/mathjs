'use strict';

function factory(type, config, load, typed) {
  var matrix   = load(require('../../type/matrix/function/matrix'));
  var add      = load(require('../arithmetic/add'));
  var divide   = load(require('../arithmetic/divide'));
  var multiply = load(require('../arithmetic/multiply'));
  var sqrt     = load(require('../arithmetic/sqrt'));
  var size     = load(require('../matrix/size'));
  var eye      = load(require('./eye'));

  /**
   * Calculate the principal square root of a square matrix.
   * The principal square root matrix `X` of another matrix `A` is such that `X * X = A`.
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
   *     det, transpose
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
            return _babylonianMethod(A);
          }
          else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + util.string.format(size) + ')');
          }
      }
    }
  });


  /**
   * Calculate the principal square root matrix using the Babylonian iterative method
   * 
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_the_Babylonian_method
   * 
   * @param  {*}        args  Parameters describing the square matrix `A`, and optional `iterations`.
   * @return {Matrix}         The principal square root of matrix `A`
   * @private
   */
  function _babylonianMethod(A, iterations) {
    iterations = typeof iterations !== 'undefined' ? iterations : 10;

    var X = eye(size(A));
    for (var i = 0; i < iterations; i++) {
      X = multiply(0.5, add(X, divide(A, X)))
    }
    return X;
  }

  sqrtm.toTex = undefined; // use default template

  return sqrtm;
}

exports.name = 'sqrtm';
exports.factory = factory;
