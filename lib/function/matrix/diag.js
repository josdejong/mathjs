'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,

      object = util.object,
      isArray = util.array.isArray,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix
   *
   * When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
   * When `x` is a two dimensional matrix, the matrixes `k`th diagonal will be returned as vector.
   * When k is positive, the values are placed on the super diagonal.
   * When k is negative, the values are placed on the sub diagonal.
   *
   * Syntax:
   *
   *     math.diag(X)
   *     math.diag(X, format)
   *     math.diag(X, k)
   *     math.diag(X, k, format)
   *
   * Examples:
   *
   *     // create a diagonal matrix
   *     math.diag([1, 2, 3]);      // returns [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *     math.diag([1, 2, 3], 1);   // returns [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]
   *     math.diag([1, 2, 3], -1);  // returns [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *
   *    // retrieve the diagonal from a matrix
   *    var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
   *    math.diag(a);   // returns [1, 5, 9]
   *
   * See also:
   *
   *     ones, zeros, eye
   *
   * @param {Matrix | Array} x          A two dimensional matrix or a vector
   * @param {Number | BigNumber} [k=0]  The diagonal where the vector will be filled
   *                                    in or retrieved.
   * @param {string} [format='dense']   The matrix storage format.
   *
   * @returns {Matrix | Array}          Diagonal matrix from input vector, or diagonal from input matrix.
   */
  math.diag = function diag (x, k, format) {
    var data, vector, i, iMax;

    if (arguments.length == 0 || arguments.length > 3) {
      throw new math.error.ArgumentsError('diag', arguments.length, 1, 3);
    }

    // matrix format
    var f;
    
    // first arg must be an array or matrix
    if (x instanceof Matrix) {
      // use same matrix format
      f = x.storage();
    }
    else if (isArray(x)) {
      
    }
    else {
      // throw
      throw new TypeError ('First parameter in function diag must be a Matrix or Array');
    }
    
    if (k) {
      // convert BigNumber to a number
      if (k instanceof BigNumber) k = k.toNumber();

      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('Second parameter in function diag must be an integer');
      }
    }
    else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // check type of input
    var asArray;
    if (x instanceof Matrix) {
      asArray = false;
    }
    else if (isArray(x)) {
      // convert to matrix
      x = math.matrix(x);
      asArray = true;
    }
    else {
      throw new TypeError ('First parameter in function diag must be a Matrix or Array');
    }

    var s = x.size();
    switch (s.length) {
      case 1:
        // x is a vector. create diagonal matrix
        vector = x.valueOf();
        var matrix = math.matrix();
        var defaultValue = (vector[0] instanceof BigNumber) ? new BigNumber(0) : 0;
        matrix.resize([vector.length + kSub, vector.length + kSuper], defaultValue);
        data = matrix.valueOf();
        iMax = vector.length;
        for (i = 0; i < iMax; i++) {
          data[i + kSub][i + kSuper] = object.clone(vector[i]);
        }
        return asArray ? matrix.valueOf() : matrix;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        data = x.valueOf();
        iMax = Math.min(s[0] - kSub, s[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = object.clone(data[i + kSub][i + kSuper]);
        }
        return asArray ? vector : math.matrix(vector);

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  };
};
