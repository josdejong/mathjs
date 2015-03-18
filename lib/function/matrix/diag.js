'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,

      object = util.object,
      array = util.array,
      isArray = array.isArray,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
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
    if (arguments.length === 0 || arguments.length > 3) {
      throw new math.error.ArgumentsError('diag', arguments.length, 1, 3);
    }
    
    // process args
    switch (arguments.length) {
      case 1:
        // defaults
        k = 0;
        format = undefined;
        break;
      case 2:
        // check second arg
        if (isString(arguments[1])) {
          // use arg as format
          format = arguments[1];
          // defaults
          k = 0;
        }
        break;
    }
    
    // verify x
    if (!(x instanceof Matrix) && !isArray(x)) {
      // throw
      throw new TypeError ('First parameter in function diag must be a Matrix or Array');
    }

    // convert BigNumber to a number if needed
    if (k instanceof BigNumber) 
      k = k.toNumber();

    // verify k
    if (!isNumber(k) || !isInteger(k)) {
      throw new TypeError ('Second parameter in function diag must be an integer');
    }
    
    // verify format
    if (format && !isString(format)) {
      // throw
      throw new TypeError ('Third parameter in function diag must be a String');
    }
    
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    var s, defaultValue, vector, d, i, iMax;
    
    // process matrix
    if (x instanceof Matrix) {
      // matrix data
      d = x.valueOf();
      // set format if needed
      format = format || x.storage();
      // matrix size
      s = x.size();
    }
    else {
      // data (array)
      d = x;
      // get size    
      s = array.size(x);
    }
     
    // check we need to return a matrix
    if (format) {
      // check length
      if (s.length === 1) {
        // default value
        defaultValue = (d[0] instanceof BigNumber) ? new BigNumber(0) : 0;
        // matrix size
        var ms = [d.length + kSub, d.length + kSuper];
        // get matrix constructor
        var F = Matrix.storage(format);
        // create diagonal matrix
        return F.diagonal(ms, d, k, defaultValue);
      }
      // check a two dimensional matrix was provided
      if (s.length === 2) {
        // return kth diagonal
        vector = x.diagonal(k);
        // return matrix
        return math.matrix(vector, format);
      }
      throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
    
    // process array length
    switch (s.length) {
      case 1:
        // default value
        defaultValue = (d[0] instanceof BigNumber) ? new BigNumber(0) : 0;
        // data
        var data = [];
        // resize array
        array.resize(data, [d.length + kSub, d.length + kSuper], defaultValue);
        // set diagonal
        iMax = d.length;
        for (i = 0; i < iMax; i++) {
          data[i + kSub][i + kSuper] = object.clone(d[i]);
        }
        return data;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        iMax = Math.min(s[0] - kSub, s[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = object.clone(d[i + kSub][i + kSuper]);
        }
        return vector;

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  };
};
