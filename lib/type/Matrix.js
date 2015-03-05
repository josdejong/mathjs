'use strict';

var util = require('../util/index');
var DimensionError = require('../error/DimensionError');

var Index = require('./Index');

var string = util.string;
var array = util.array;
var object = util.object;

var isArray = Array.isArray;
var validateIndex = array.validateIndex;
var isString = string.isString;

module.exports = function (config) {

  /**
   * @constructor Matrix
   *
   * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
   * array. A matrix can be constructed as:
   *     var matrix = new Matrix(data)
   *
   * Matrix contains the functions to resize, get and set values, get the size,
   * clone the matrix and to convert the matrix to a vector, array, or scalar.
   * Furthermore, one can iterate over the matrix using map and forEach.
   * The internal Array of the Matrix can be accessed using the function valueOf.
   *
   * Example usage:
   *     var matrix = new Matrix([[1, 2], [3, 4]]);
   *     matix.size();              // [2, 2]
   *     matrix.resize([3, 2], 5);
   *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
   *     matrix.subset([1,2])       // 3 (indexes are zero-based)
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format, defaults to 'dense'
   */
  function Matrix(data, format) {
    if (!(this instanceof Matrix)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (data instanceof Matrix) {
      // check we need to change storage format
      if (!format || format === data._storage.format()) {
        // clone storage
        this._storage = data._storage.clone();
      }
      else {
        // change storage format, TODO: find a better solution
        this._storage = _createStorage(data._storage.toArray(), format);
      }
    }
    else if (isArray(data)) {
      // create storage
      this._storage = _createStorage(data, format);
    }
    else if (typeof data === 'object' && data.mathjs === 'Matrix' && data.storage) {
      // create Matrix from json representation
      this._storage = _createStorage(data.storage);
    }
    else if (data != null) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // create storage
      this._storage = _createStorage([], format);
    }
  }
    
  var _createStorage = function (data, format) {
    // check data is an array
    if (isArray(data)) {
      // format to use
      format = format || 'default';
      // check format
      if (!isString(format))
        throw new TypeError('format must be a string value');
      // get format constructor
      var f = Matrix.format[format];
      if (!f)
        throw new SyntaxError('Unsupported Matrix Storage Format: ' + format);
      // create instance
      return new f(data);
    }
    // check it is a storage json representation
    if (typeof data === 'object' && isString(data.format)) {
      // get format constructor
      var f = Matrix.format[data.format];
      if (!f)
        throw new SyntaxError('Unsupported Matrix Storage Format: ' + data.format);
      // deserialize json
      return f.fromJSON(data);
    }
    throw new SyntaxError('Unsupported data structure');
  };

  /**
   * Test whether an object is a Matrix
   * @param {*} object
   * @return {Boolean} isMatrix
   */
  Matrix.isMatrix = function (object) {
    return (object instanceof Matrix);
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
    // delegate to storage implementation
    return this._storage.subset(index, replacement, defaultValue);
  };

  /**
   * Get a single element from the matrix.
   * @param {Number[]} index   Zero-based index
   * @return {*} value
   */
  Matrix.prototype.get = function (index) {
    // delegate to storage implementation
    return this._storage.get(index);
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
    // delegate to storage implementation
    this._storage.set(index, value, defaultValue);

    // return the matrix itself
    return this;
  };

  /**
   * Resize the matrix
   * @param {Number[]} size
   * @param {*} [defaultValue=0]      Default value, filled in on new entries.
   *                                  If not provided, the matrix elements will
   *                                  be filled with zeros.
   * @return {Matrix} self            The matrix itself is returned
   */
  Matrix.prototype.resize = function (size, defaultValue) {
    // delegate to storage implementation
    this._storage.resize(size, defaultValue);

    // return the matrix itself
    return this;
  };

  /**
   * Create a clone of the matrix
   * @return {Matrix} clone
   */
  Matrix.prototype.clone = function () {
    return new Matrix(this);
  };

  /**
   * Retrieve the size of the matrix.
   * @returns {Number[]} size
   */
  Matrix.prototype.size = function() {
    // delegate to storage implementation
    return this._storage.size();
  };

  /**
   * Create a new matrix with the results of the callback function executed on
   * each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @return {Matrix} matrix
   */
  Matrix.prototype.map = function (callback) {
    // current instance
    var me = this;
    // create matrix from storage map
    return new Matrix({
      mathjs: 'Matrix',
      storage: this._storage.map(callback, me).toJSON()
    });
  };

  /**
   * Execute a callback function on each entry of the matrix.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   */
  Matrix.prototype.forEach = function (callback) {
    // current instance
    var me = this;
    // delegate to storage implementation
    this._storage.forEach(callback, me);
  };

  /**
   * Create an Array with a copy of the data of the Matrix
   * @returns {Array} array
   */
  Matrix.prototype.toArray = function () {
    // delegate to storage implementation
    return this._storage.toArray();
  };

  /**
   * Get the primitive value of the Matrix: a multidimensional array
   * @returns {Array} array
   */
  Matrix.prototype.valueOf = function () {
    // delegate to storage implementation
    return this._storage.valueOf();
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
    // TODO: find better implementation for sparse matrix formats
    return string.format(this._storage.toArray(), options);
  };

  /**
   * Get a string representation of the matrix
   * @returns {String} str
   */
  Matrix.prototype.toString = function () {
    // delegate to storage implementation
    return this._storage.toString();
  };

  /**
   * Get a JSON representation of the matrix
   * @returns {Object}
   */
  Matrix.prototype.toJSON = function () {
    return {
      mathjs: 'Matrix',
      storage: this._storage.toJSON()
    }
  };

  /**
   * Generate a matrix from a JSON object
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "Matrix", data: []}`,
   *                       where mathjs is optional
   * @returns {Matrix}
   */
  Matrix.fromJSON = function (json) {
    return new Matrix(json);
  };

  // exports
  return Matrix;
};