'use strict';

var DimensionError = require('../../../error/DimensionError');

var util = require('../../../util/index'),
    array = util.array,
    string = util.string,
    
    isArray = Array.isArray;    

function factory () {
 
  /**
   * @Constructor Set
   * Create a Set. A Set can store a list of numbers.
   * Used as one of the possible values in Index dimensions.
   *
   * Usage:
   *     var set = new Set([1, 2, 3]);
   *
   * @param {Array} data
   */
  function Set(data) {
    if (!(this instanceof Set)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // check data
    if (isArray(data)) {
      // array size
      var asize = array.size(data);
      // must be a vector
      if (asize.length === 1) {
        // initialize values
        this._values = data;
        this._min = null;
        this._max = null;
      }
      else {
        // dimension error
        throw new DimensionError(asize.length, 1, '<');
      }
    }
    else if (data && data.isDenseMatrix) {
      // matrix size
      var msize = array.size(data);
      // must be a vector
      if (msize.length === 1) {
        // initialize values
        this._values = data.valueOf();
        this._min = null;
        this._max = null;
      }
      else {
        // dimension error
        throw new DimensionError(msize.length, 1, '<');
      }
    }
    else if (data && isArray(data.values)) {
      // create from json
      this._values = data.values;
      this._min = data.min;
      this._max = data.max;
    }
    else if (data) {
      // unsupported type
      throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
    }
    else {
      // nothing provided
      this._values = [];
      this._min = null;
      this._max = null;
    }
  }

  /**
   * Attach type information
   */
  Set.prototype.type = 'Set';
  Set.prototype.isSet = true;

  /**
   * Create a clone of the set
   * @return {Set} clone
   */
  Set.prototype.clone = function () {
    return new Set(this.start, this.end, this.step);
  };

  /**
   * Retrieve the size of the set.
   * Returns an array containing one number, the number of elements in the set.
   * @returns {Number[]} size
   */
  Set.prototype.size = function () {    
    return [this._values.length];
  };

  /**
   * Calculate the minimum value in the set
   * @return {Number | undefined} min
   */
  Set.prototype.min = function () {
    // check set is empty
    if (this._values.length > 0) {
      // check min has been calculated before
      if (this._min === null) {
        // compute min
        this._min = Math.min.apply(null, this._values);
      }
      return this._min;
    }
    return undefined;
  };

  /**
   * Calculate the maximum value in the set
   * @return {Number | undefined} max
   */
  Set.prototype.max = function () {
    // check set is empty
    if (this._values.length > 0) {
      // check max has been calculated before
      if (this._max === null) {
        // compute max
        this._max = Math.max.apply(null, this._values);
      }
      return this._max;
    }
    return undefined;
  };


  /**
   * Execute a callback function for each value in the set.
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Set being traversed.
   */
  Set.prototype.forEach = function (callback) {
    // values
    var values = this._values;
    // loop items in array
    for (var i = 0, l = values.length; i < l; i++) {
      // invoke callback
      callback(values[i], i, this);
    }
  };

  /**
   * Execute a callback function for each value in the Set, and return the
   * results as an array
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Set being traversed.
   * @returns {Array} array
   */
  Set.prototype.map = function (callback) {
    // result
    var array = [];
    // values
    var values = this._values;
    // loop items in array
    for (var i = 0, l = values.length; i < l; i++) {
      // invoke callback
      array[i] = callback(values[i], i, this);
    }
    return array;
  };

  /**
   * Create an Array with a copy of the Sets data
   * @returns {Array} array
   */
  Set.prototype.toArray = function () {
    return this._values;
  };

  /**
   * Get the primitive value of the Set, a one dimensional array
   * @returns {Array} array
   */
  Set.prototype.valueOf = function () {
    return this._values;
  };

  /**
   * Get a string representation of the set, with optional formatting options.
   * @param {Object | Number | Function} [options]  Formatting options. See
   *                                                lib/util/number:format for a
   *                                                description of the available
   *                                                options.
   * @returns {String} str
   */
  Set.prototype.format = function (options) {
    return string.format(this._values, options);
  };

  /**
   * Get a string representation of the set.
   * @returns {String}
   */
  Set.prototype.toString = function () {
    return this.format();
  };

  /**
   * Get a JSON representation of the set
   * @returns {Object} Returns a JSON object structured as:
   *                   `{"mathjs": "Set", "start": 2, "end": 4, "step": 1}`
   */
  Set.prototype.toJSON = function () {
    return {
      mathjs: 'Set',
      values: this._values,      
      min: this._min,
      max: this._max
    };
  };

  /**
   * Instantiate a Set from a JSON object
   * @param {Object} json A JSON object structured as:
   *                      `{"mathjs": "Set", "start": 2, "end": 4, "step": 1}`
   * @return {Set}
   */
  Set.fromJSON = function (json) {
    return new Set(json);
  };

  return Set;
}

exports.name = 'Set';
exports.path = 'type';
exports.factory = factory;
