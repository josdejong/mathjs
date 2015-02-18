'use strict';

var util = require('../util/index'),

    Range = require('./Range'),

    number = util.number,

    isNumber = number.isNumber,
    isInteger = number.isInteger,
    isArray = Array.isArray;

/**
 * @Constructor Index
 * Create an index. An Index can store ranges having start, step, and end
 * for multiple dimensions.
 * Matrix.get, Matrix.set, and math.subset accept an Index as input.
 *
 * Usage:
 *     var index = new Index(range1, range2, ...);
 *
 * Where each range can be any of:
 *     An array [start, end]
 *     An array [start, end, step]
 *     A number
 *     An instance of Range
 *
 * The parameters start, end, and step must be integer numbers.
 *
 * @param {...*} ranges
 */
function Index(ranges) {
  if (!(this instanceof Index)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this._ranges = [];
  this._isScalar = true;

  for (var i = 0, ii = arguments.length; i < ii; i++) {
    var arg = arguments[i];

    if (arg instanceof Range) {
      this._ranges.push(arg);
      this._isScalar = false;
    }
    else if (isArray(arg)) {
      this._ranges.push(_createRange(arg));
      this._isScalar = false;
    }
    else if (isNumber(arg)) {
      this._ranges.push(_createRange([arg, arg + 1]));
    }
    // TODO: implement support for wildcard '*'
    else {
      var primitive = arg.valueOf(); // for example turn a Matrix into an Array
      if (isArray(primitive)) {
        this._ranges.push(_createRange(primitive));
        this._isScalar = false;
      }
      else {
        throw new TypeError('Ranges must be an Array, Number, or Range');
      }
    }
  }
}

/**
 * Parse an argument into a range and validate the range
 * @param {Array} arg  An array with [start: Number, end: Number] and
 *                     optional a third element step:Number
 * @return {Range} range
 * @private
 */
function _createRange(arg) {
  // TODO: make function _createRange simpler/faster

  // test whether all arguments are integers
  var num = arg.length;
  for (var i = 0; i < num; i++) {
    if (!isNumber(arg[i]) || !isInteger(arg[i])) {
      throw new TypeError('Index parameters must be integer numbers');
    }
  }

  switch (arg.length) {
    case 2:
      return new Range(arg[0], arg[1]); // start, end
    case 3:
      return new Range(arg[0], arg[1], arg[2]); // start, end, step
    default:
      // TODO: improve error message
      throw new SyntaxError('Wrong number of arguments in Index (2 or 3 expected)');
  }
}

/**
 * Create a clone of the index
 * @return {Index} clone
 */
Index.prototype.clone = function () {
  var index = new Index();
  index._ranges = util.object.clone(this._ranges);
  index._isScalar = this._isScalar;
  return index;
};

/**
 * Test whether an object is an Index
 * @param {*} object
 * @return {Boolean} isIndex
 */
Index.isIndex = function (object) {
  return (object instanceof Index);
};

/**
 * Create an index from an array with ranges/numbers
 * @param {Array.<Array | Number>} ranges
 * @return {Index} index
 * @private
 */
Index.create = function (ranges) {
  var index = new Index();
  Index.apply(index, ranges);
  return index;
};

/**
 * Retrieve the size of the index, the number of elements for each dimension.
 * @returns {Number[]} size
 */
Index.prototype.size = function () {
  var size = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];

    size[i] = range.size()[0];
  }

  return size;
};

/**
 * Get the maximum value for each of the indexes ranges.
 * @returns {Number[]} max
 */
Index.prototype.max = function () {
  var values = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];
    values[i] = range.max();
  }

  return values;
};

/**
 * Get the minimum value for each of the indexes ranges.
 * @returns {Number[]} min
 */
Index.prototype.min = function () {
  var values = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];

    values[i] = range.min();
  }

  return values;
};

/**
 * Loop over each of the ranges of the index
 * @param {function} callback   Called for each range with a Range as first
 *                              argument, the dimension as second, and the
 *                              index object as third.
 */
Index.prototype.forEach = function (callback) {
  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    callback(this._ranges[i], i, this);
  }
};

/**
 * Retrieve the range for a given dimension number from the index
 * @param {Number} dim                  Number of the dimension
 * @returns {Range | null} range
 */
Index.prototype.range = function(dim) {
  return this._ranges[dim] || null;
};

/**
 * Test whether this index contains only a single value.
 *
 * This is the case when the index is created with only scalar values as ranges,
 * not for ranges resolving into a single value.
 * @return {boolean} isScalar
 */
Index.prototype.isScalar = function () {
  return this._isScalar;
};

/**
 * Expand the Index into an array.
 * For example new Index([0,3], [2,7]) returns [[0,1,2], [2,3,4,5,6]]
 * @returns {Array} array
 */
Index.prototype.toArray = function () {
  var array = [];
  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i],
        row = [],
        x = range.start,
        end = range.end,
        step = range.step;

    if (step > 0) {
      while (x < end) {
        row.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        row.push(x);
        x += step;
      }
    }

    array.push(row);
  }

  return array;
};

/**
 * Get the primitive value of the Index, a two dimensional array.
 * Equivalent to Index.toArray().
 * @returns {Array} array
 */
Index.prototype.valueOf = Index.prototype.toArray;

/**
 * Get the string representation of the index, for example '[2:6]' or '[0:2:10, 4:7]'
 * @returns {String} str
 */
Index.prototype.toString = function () {
  var strings = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];
    var str = number.format(range.start);
    if (range.step != 1) {
      str += ':' + number.format(range.step);
    }
    str += ':' + number.format(range.end);
    strings.push(str);
  }

  return '[' + strings.join(', ') + ']';
};

/**
 * Get a JSON representation of the Index
 * @returns {Object} Returns a JSON object structured as:
 *                   `{"mathjs": "Index", "ranges": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
 */
Index.prototype.toJSON = function () {
  return {
    mathjs: 'Index',
    ranges: this._ranges
  };
};

/**
 * Instantiate an Index from a JSON object
 * @param {Object} json A JSON object structured as:
 *                     `{"mathjs": "Index", "ranges": [{"mathjs": "Range", start: 0, end: 10, step:1}, ...]}`
 * @return {Index}
 */
Index.fromJSON = function (json) {
  return Index.create(json.ranges);
};

// exports
module.exports = Index;
