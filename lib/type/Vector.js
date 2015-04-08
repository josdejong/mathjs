'use strict';

var string = require('../util/string');
var isString = string.isString;

function factory (type, config, load, typed) {
    
  function Vector() {
    if (!(this instanceof Vector)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }
  }
  
  /**
   * Test whether an object is a Vector
   * @param {*} object
   * @return {Boolean} isVector
   */
  Vector.isVector = function (object) {
    return (object instanceof Vector);
  };
  
  /**
   * Get a single element from the vector.
   * @param {Number} index   Zero-based index
   * @return {*} value
   */
  Vector.prototype.get = function (index) {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke get on a Vector interface');
  };
  
  // a map with all constructors for storage types
  Vector._storage = {};
  
  /**
   * Get the Vector storage constructor for the given format.
   *
   * @param {string} format       The Vector storage format.
   *
   * @return {Function}           The Vector storage constructor.
   */
  Vector.storage = function (format) {
    // check storage format is a string
    if (!isString(format)) {
      throw new TypeError('format must be a string value');
    }

    // get storage format constructor
    var constructor = Vector._storage[format];
    if (!constructor) {
      throw new SyntaxError('Unsupported vector storage format: ' + format);
    }

    // return storage constructor
    return constructor;
  };
  
  /**
   * Get the storage format used by the vector.
   *
   * Usage:
   *     var format = vector.storage()                   // retrieve storage format
   *
   * @return {string}           The storage format.
   */
  Vector.prototype.storage = function () {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke storage on a Vector interface');
  };
  
  /**
   * Replace a single element in the vector.
   * @param {Number} index   Zero-based index
   * @param {*} value
   * @param {*} [defaultValue]        Default value, filled in on new entries when
   *                                  the vector is resized. If not provided,
   *                                  new vector elements will be left undefined.
   *
   * @return {Vector} self
   */
  Vector.prototype.set = function (index, value, defaultValue) {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke set on a Vector interface');
  };

  /**
   * Create a clone of the vector
   * @return {Vector} clone
   */
  Vector.prototype.clone = function () {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke clone on a Vector interface');
  };
  
  /**
   * Retrieve the size of the vector.
   * @returns {Number} size
   */
  Vector.prototype.size = function() {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke size on a Vector interface');
  };
  
  /**
   * Execute a callback function on each entry of the vector.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Vector being traversed.
   */
  Vector.prototype.forEach = function (callback) {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke forEach on a Vector interface');
  };
  
  /**
   * Create a new vector with the results of the callback function executed on
   * each entry of the vector.
   * @param {function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Vector being traversed.
   * @param {boolean} [skipZeros] Invoke callback function for non-zero values only.
   *
   * @return {Vector} vector
   */
  Vector.prototype.map = function (callback, skipZeros) {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke map on a Vector interface');
  };
  
  return Vector;
}

exports.name = 'Vector';
exports.path = 'type';
exports.factory = factory;
