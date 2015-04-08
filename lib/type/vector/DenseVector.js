'use strict';

var util = require('../../util/index');

var string = util.string;
var array = util.array;
var object = util.object;

var isArray = Array.isArray;
var isNumber = util.number.isNumber;
var isInteger = util.number.isInteger;
var isString = string.isString;

var validateIndex = array.validateIndex;

function factory (type, config, load, typed) {

  var Vector = type.Vector;
  
  function DenseVector(data) {
    if (!(this instanceof DenseVector))
      throw new SyntaxError('Constructor must be called with the new operator');
    
    if (data instanceof Vector) {
    }
    else if (data instanceof type.Matrix) {
      // create from matrix
      _createFromMatrix(this, data);
    }
    else if (data && isArray(data.data)) {
      // initialize fields
      this._data = data.data;
    }
    else if (isArray(data)) {
      // create from array
      _createFromArray(this, data);
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._data = [];
    }
  }
  
  DenseVector.prototype = new Vector();

  DenseVector.prototype.type = 'DenseVector';
  
  var _createFromMatrix = function (vector, source) {
  };
  
  var _createFromArray = function (vector, source) {
    // vector data & length
    var data, length;
    // array size
    var size = array.size(source);
    // check array dimensions
    switch (size.length) {
      case 1:
        // length
        length = size[0];
        // initialize data
        data = new Array(length);
        // copy values
        for (var i = 0; i < length; i++)
          data[i] = source[i];
        break;
    }
    // initialize vector
    vector._data = data;
  };  
  
  /**
   * Get a single element from the vector.
   * @param {Number} index            Zero-based index
   * @param {*} [defaultValue]        Value to return if vector does not
   *                                  have a value @ index
   *
   * @return {*} value
   */
  DenseVector.prototype.get = function (index, defaultValue) {
    // check index
    validateIndex(index, this._data.length);
    // value @ index
    var v = this._data[index];
    if (typeof v === 'undefined')
      return defaultValue;
    return v;
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
  DenseVector.prototype.set = function (index, value, defaultValue) {
    // must be implemented by each of the Vector implementations
    throw new Error('Cannot invoke set on a Vector interface');
  };
  
  /**
   * Create a clone of the vector
   * @return {Vector} clone
   */
  DenseVector.prototype.clone = function () {
    // clone vector
    return new DenseVector({
      data: object.clone(this._data)
    });
  };
  
  /**
   * Retrieve the size of the vector.
   * @returns {Number} size
   */
  DenseVector.prototype.size = function() {
    // return vector length
    return this._data.length;
  };
  
  return DenseVector;
}

exports.name = 'DenseVector';
exports.path = 'type';
exports.factory = factory;
