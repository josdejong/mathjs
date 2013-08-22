var util = require('../util/index'),
    Range = require('./Range');

    number = util.number,

    isNumber = number.isNumber,
    isInteger = number.isInteger,
    isArray = Array.isArray,
    validateIndex = util.array.validateIndex;

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
    throw new SyntaxError(
        'Index constructor must be called with the new operator');
  }

  this._ranges = [];

  for (var i = 0, ii = arguments.length; i < ii; i++) {
    var arg = arguments[i];

    if (arg instanceof Range) {
      this._ranges.push(arg);
    }
    else {
      if (arg) {
        arg = arg.valueOf();
      }

      if (isArray(arg)) {
        this._ranges.push(_createRange(arg));
      }
      else if (isNumber(arg)) {
        this._ranges.push(_createRange([arg, arg + 1]));
      }
      // TODO: implement support for wildcard '*'
      // TODO: implement support for a string 'start:step:end'
      else {
        throw new TypeError('Range expected as Array, Number, or String');
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
Index.prototype.clone = function clone () {
  var index = new Index();
  index._ranges = util.object.clone(this._ranges);
  return index;
};

/**
 * Test whether an object is an Index
 * @param {*} object
 * @return {Boolean} isIndex
 */
Index.isIndex = function isIndex(object) {
  return (object instanceof Index);
};

/**
 * Create an index from an array with ranges/numbers
 * @param {Array.<Array | Number>} ranges
 * @return {Index} index
 * @private
 */
Index.create = function create(ranges) {
  var index = new Index();
  Index.apply(index, ranges);
  return index;
};

/**
 * Retrieve the size of the index.
 * @returns {Number[]} size
 */
Index.prototype.size = function () {
  var size = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];

    if (range instanceof Range) {
      size.push(range.size()[0]);
    }
    else {
      size.push(null);
    }
  }

  return size;
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
 * @returns {Range | undefined} range
 */
Index.prototype.range = function (dim) {
  return this._ranges[dim];
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

  return '[' + strings.join(',') + ']';
};

/**
 * Test whether a multidimensional array contains a scalar
 * @param array
 * @returns {*}
 */
function isScalar(array) {
  while (isArray(array)) {
    if (array.length !== 1) {
      return false;
    }
    array = array[0];
  }

  return true;
}

/**
 * Retrieve the scalar value from a multidimensional matrix containing only
 * a single scalar.
 * @param array
 * @returns {*} scalar
 * @private
 */
function toScalar(array) {
  while (isArray(array)) {
    if (array.length !== 1) {
      throw new Error('Array does not contain a single scalar');
    }
    array = array[0];
  }

  return array;
}

// exports
module.exports = Index;

// to trick my IDE which doesn't get it
exports.isIndex = Index.isIndex;
exports.create = Index.create;

util.types.addType('index', Index);
