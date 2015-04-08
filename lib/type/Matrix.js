'use strict';

var util = require('../util/index');

var string = util.string;
var array = util.array;

var isString = string.isString;
var isArray = Array.isArray;

function factory (type, config, load, typed) {
  /**
   * @constructor Matrix
   *
   * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
   * array. A matrix can be constructed as:
   *     var matrix = math.matrix(data)
   *
   * Matrix contains the functions to resize, get and set values, get the size,
   * clone the matrix and to convert the matrix to a vector, array, or scalar.
   * Furthermore, one can iterate over the matrix using map and forEach.
   * The internal Array of the Matrix can be accessed using the function valueOf.
   *
   * Example usage:
   *     var matrix = math.matrix([[1, 2], [3, 4]]);
   *     matix.size();              // [2, 2]
   *     matrix.resize([3, 2], 5);
   *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
   *     matrix.subset([1,2])       // 3 (indexes are zero-based)
   *
   */
  function Matrix() {
    if (!(this instanceof Matrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }

  /**
   * Test whether an object is a Matrix
   * @param {*} object
   * @return {Boolean} isMatrix
   */
  Matrix.isMatrix = function (object) {
    return (object instanceof Matrix);
  };

  /**
   * Get the Matrix storage constructor for the given format.
   *
   * @param {string} format       The Matrix storage format.
   *
   * @return {Function}           The Matrix storage constructor.
   */
  Matrix.storage = function (format) {
    // check storage format is a string
    if (!isString(format)) {
      throw new TypeError('format must be a string value');
    }

    // get storage format constructor
    var constructor = Matrix._storage[format];
    if (!constructor) {
      throw new SyntaxError('Unsupported matrix storage format: ' + format);
    }

    // return storage constructor
    return constructor;
  };

  // a map with all constructors for all storage types
  Matrix._storage = {};

  /**
   * Get the storage format used by the matrix.
   *
   * Usage:
   *     var format = matrix.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  Matrix.prototype.storage = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke storage on a Matrix interface');
  };
  
  /**
   * Get a subset of the matrix, or replace a subset of the matrix.
   *
   * Usage:
   *     var subset = matrix.subset(index)               // retrieve subset
   *     var value = matrix.subset(index, replacement)   // replace subset
   *
   * @param {Index} index
   * @param {Array | Matrix | *} [replacement]
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be filled with zeros.
   */
  Matrix.prototype.subset = function (index, replacement, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke subset on a Matrix interface');
  };

  /**
   * Get a single element from the matrix.
   * @param {Number[]} index   Zero-based index
   * @return {*} value
   */
  Matrix.prototype.get = function (index) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke get on a Matrix interface');
  };

  /**
   * Replace a single element in the matrix.
   * @param {Number[]} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  new matrix elements will be left undefined.
   * @return {Matrix} self
   */
  Matrix.prototype.set = function (index, value, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke set on a Matrix interface');
  };

  /**
   * Resize the matrix to the given size. Returns a copy of the matrix when 
   * `copy=true`, otherwise return the matrix itself (resize in place).
   *
   * @param {Number[]} size           The new size the matrix should have.
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @param {boolean} [copy]          Return a resized copy of the matrix
   *
   * @return {Matrix}                 The resized matrix
   */
  Matrix.prototype.resize = function (size, defaultValue) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke resize on a Matrix interface');
  };

  /**
   * Create a clone of the matrix
   * @return {Matrix} clone
   */
  Matrix.prototype.clone = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke clone on a Matrix interface');
  };

  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  Matrix.prototype.size = function() {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke size on a Matrix interface');
  };

  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {Matrix} matrix
   */
  Matrix.prototype.map = function (callback, skipZeros) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke map on a Matrix interface');
  };

  /**
   * Execute a callback function on each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  Matrix.prototype.forEach = function (callback) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke forEach on a Matrix interface');
  };

  /**
   * Create an Array with a copy of the data of the Matrix
   * @returns {Array} array
   */
  Matrix.prototype.toArray = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toArray on a Matrix interface');
  };

  /**
   * Get the primitive value of the Matrix: a multidimensional array
   * @returns {Array} array
   */
  Matrix.prototype.valueOf = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke valueOf on a Matrix interface');
  };

  /**
   * Get a string representation of the matrix, with optional formatting options.
   * @param {Object | Number | Function} [options]  Formatting options. See
   *                                                lib/util/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {String} str
   */
  Matrix.prototype.format = function (options) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke format on a Matrix interface');
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  Matrix.prototype.toString = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke toString on a Matrix interface');
  };

  /**
   * Calculates the transpose of the matrix
   * @returns {Matrix}
   */
  Matrix.prototype.transpose = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke transpose on a Matrix interface');
  };

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * See also:
   *
   *    diagonal
   *
   * @returns {Number}       The matrix trace
   */
  Matrix.prototype.trace = function () {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke transpose on a Matrix interface');
  };

  /**
   * Multiply the matrix values times the argument.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} Value to multiply.
   *
   * @return {Number | BigNumber | Complex | Unit | Matrix}
   */
  Matrix.prototype.multiply = function (value) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke multiply on a Matrix interface');
  };
  
  /**
   * LU decomposition with pivoting. Matrix A is decomposed in three matrices (L, U, P) where:
   * P * A = L * U
   *
   * @return {Object with fields L, U and P} The lower triangular matrix, the upper triangular matrix and the permutation matrix.
   */
  Matrix.prototype.lup = function (value) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke lup on a Matrix interface');
  };
  
  /**
   * Solves the linear equation system by forward substitution. Matrix must be a lower triangular matrix.
   *
   * M * x = b
   *
   * @param {Matrix, Array}         A column vector with the b values
   *
   * @return {Matrix}               A vector with the linear system solution
   */
  Matrix.prototype.forwardSubstitution = function (b) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke forwardSubstitution on a Matrix interface');
  };
  
  /**
   * Solves the linear equation system by backward substitution. Matrix must be an upper triangular matrix.
   *
   * M * x = b
   *
   * @param {Matrix, Array}         A column vector with the b values.
   *
   * @return {Matrix}               A vector with the linear system solution.
   */
  Matrix.prototype.backwardSubstitution = function (b) {
    // must be implemented by each of the Matrix implementations
    throw new Error('Cannot invoke backwardSubstitution on a Matrix interface');
  };
  
  /**
   * Validates matrix and column vector b for backward/forward substitution algorithms.
   *
   * @return {Function} Column vector accessor function
   */
  Matrix.prototype._substitutionValidation = function (b) {
    // validate matrix dimensions
    if (this._size.length !== 2)
      throw new RangeError('Matrix must be two dimensional (size: ' + string.format(this._size) + ')');
    // rows & columns
    var rows = this._size[0];
    var columns = this._size[1];
    // validate rows & columns
    if (rows !== columns) 
      throw new RangeError('Matrix must be square (size: ' + string.format(this._size) + ')');
    // check b is matrix
    if (b instanceof Matrix) {
      // matrix size
      var msize = b.size();
      // check matrix dimensions, vector
      if (msize.length === 1) {
        // check vector length
        if (msize[0] !== rows)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // return vector accessor
        return function (i) {
          return b.get([i]);
        };
      }
      // check matrix dimensions, column vector
      if (msize.length === 2) {
        // array must be a column vector
        if (msize[0] !== rows || msize[1] !== 1)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // return vector accessor
        return function (i) {
          return b.get([i, 0]);
        };
      }
      throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
    }
    // check b is array
    if (isArray(b)) {
      // size
      var asize = array.size(b);
      // check matrix dimensions, vector
      if (asize.length === 1) {
        // check vector length
        if (asize[0] !== rows)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // return vector accessor
        return function (i) {
          return b[i];
        };
      }
      // check matrix dimensions, column vector
      if (asize.length === 2) {
        // array must be a column vector
        if (asize[0] !== rows || asize[1] !== 1)
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
        // return vector accessor
        return function (i) {
          return b[i][0];
        };
      }
      throw new RangeError('Dimension mismatch. Matrix columns must match vector length.');
    }
  };
  
  // exports
  return Matrix;
}

exports.name = 'Matrix';
exports.path = 'type';
exports.factory = factory;
