var util = require('../util/index.js'),

    number = util.number,
    object = util.object,

    isNumber = number.isNumber,
    isInteger = number.isInteger,
    isString = util.string.isString,
    isArray = Array.isArray,
    validateIndex = util.array.validateIndex;
    clone = object.clone;

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
 *     null,   this will create select the whole dimension
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
    if (arg) {
      arg = arg.valueOf();
    }
    if (isArray(arg)) {
      this._ranges.push(_createRange(arg));
    }
    else if (isNumber(arg)) {
      this._ranges.push(_createRange([arg, arg + 1]));
    }
    else if (arg === null) {
      this._ranges.push(null);
    }
    // TODO: implement support for a string 'start:step:end'
    else {
      throw new TypeError('Range expected as Array, Number, or String');
    }
  }
}

/**
 * Parse an argument into a range and validate the range
 * @param {Array} arg  An array with [start: Number, end: Number] and
 *                     optional a third element step:Number
 * @return {{start:Number, end: Number, step: Number}} range
 * @private
 */
function _createRange(arg) {
  var start, end, step;
  var num = arg.length;

  if (num < 2 || num > 3) {
    // TODO: improve error message
    throw new SyntaxError('Wrong number of arguments in Index (0, 2, or 3 expected)');
  }

  start = arg[0];
  end = arg[1];
  step = (num > 2) ? arg[2] : 1;

  if (!isNumber(start) || !isInteger(start)) {
    throw new TypeError('Parameter start must be an integer number');
  }
  if (!isNumber(end) || !isInteger(end)) {
    throw new TypeError('Parameter end must be an integer number');
  }
  if (step !== undefined && (!isNumber(step) || !isInteger(step))) {
    throw new TypeError('Parameter step must be an integer number');
  }

  return {
    start: start,
    end: end,
    step: step
  };
}

// TODO: create Index.parse

/**
 * Create a clone of the index
 * @return {Index} clone
 */
Index.prototype.clone = function clone () {
  var index = new Index();
  index._ranges = object.clone(this._ranges);
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
 * Retrieve the size of the index.
 * @returns {Number[]} size
 */
Index.prototype.size = function () {
  var size = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];

    if (range) {
      var diff = range.end - range.start;

      if (number.sign(range.step) == number.sign(diff)) {
        size.push(Math.ceil((diff) / range.step));
      }
      else {
        size.push(0);
      }
    }
    else {
      size.push(null);
    }
  }

  return size;
};

/**
 * Get or set a subset of a matrix or string
 *
 * Usage:
 *     var subset = Index.subset(value, index)               // retrieve subset
 *     var value = Index.subset(value, index, replacement)   // replace subset
 *
 * Where:
 *     {*} value        An array, matrix, or scalar value
 *     {Array} index    An array containing index values
 *     {*} replacement  An array, matrix, or scalar
 *
 * @param {Index | Array} index
 * @param {Array} array
 * @param {Array} [replacement]
 * @return {Array} res
 */
Index.subset = function subset (index, array, replacement) {
  var num = arguments.length,
      clone;

  if (index instanceof Index) {
    _validate(index, array);

    if (num == 2) {
      return _getIndex(array, index._ranges, 0);
    }
    else if (num == 3) {
      clone = object.clone(array);
      _setIndex(clone, replacement, index._ranges, 0);
      return clone;
    }
    else {
      // TODO: better error message
      throw new SyntaxError('Wrong number of arguments');
    }
  }
  else if (index instanceof Array) {
    if (num == 2) {
      return _getArray(array, index, 0);
    }
    else if (num == 3) {
      clone = object.clone(array);
      _setArray(clone, replacement, index, 0);
      return clone;
    }
    else {
      // TODO: better error message
      throw new SyntaxError('Wrong number of arguments');
    }
  }
  else {
    // TODO: implement support for Matrix as index?
    throw new TypeError('Index or Array expected as first argument');
  }
};

/**
 * Validate whether each range of an Index is inside given array
 * Throws an error when out of range
 * @param {Index} index
 * @param {Array} array
 * @private
 * @throws RangeError
 */
function _validate(index, array) {
  var size = util.array.size(array);
  var ranges = index._ranges;

  if (ranges.length != size.length) {
    throw new RangeError('Dimensions mismatch (' + ranges.length + ' != ' + size.length + ')');
  }

  for (var i = 0, ii = ranges.length; i < ii; i++) {
    var range = ranges[i];

    if (range) {
      if (range.step > 0) {
        if (range.start < 0) {
          throw new RangeError('Index out of range (' + range.start + ' < 0)');
        }
        if (range.end > size[i]) {
          throw new RangeError('Index out of range (' + range.end + ' > ' + size[i] + ')');
        }
      }
      else {
        if (range.start > size[i] - 1) {
          throw new RangeError('Index out of range (' + range.start + ' > ' + (size[i] - 1) + ')');
        }
        if (range.end < -1) {
          throw new RangeError('Index out of range (' + range.end + ' < -1)');
        }
      }
    }
  }
}

/**
 * Recursively get a subset of a multi dimensional array.
 * Index is not checked for correct number of dimensions.
 * @param {Array} array
 * @param {Array} ranges
 * @param {number} dim
 * @return {Array} subset
 * @private
 */
function _getIndex (array, ranges, dim) {
  var subset = [],
      range = ranges[dim],
      last = (dim == ranges.length - 1),
      x, end, step;

  if (range) {
    // range
    x = range.start;
    end = range.end;
    step = range.step;
  }
  else {
    // all
    x = 0;
    end = array.length;
    step = 1;
  }

  if (!last) {
    // not the last dimension. recursively run the next dimension
    if (step > 0) {
      while (x < end) {
        subset.push(_getIndex(array[x], ranges, dim + 1));
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        subset.push(_getIndex(array[x], ranges, dim + 1));
        x += step;
      }
    }
  }
  else {
    // last dimension. get values
    if (step > 0) {
      while (x < end) {
        subset.push(array[x]);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        subset.push(array[x]);
        x += step;
      }
    }
  }

  return subset;
}

/**
 * Recursively get a subset of a multi dimensional array.
 * Index is not checked for correct number of dimensions.
 * @param {Array} array
 * @param {Array} indexes
 * @param {number} dim
 * @return {Array} subset
 * @private
 */
function _getArray (array, indexes, dim) {
  var subset = [],
      index = indexes[dim],
      isNull = false,
      len,
      last = (dim == indexes.length - 1),
      x, i;

  if (isArray(index)) {
    len = index.length;
  }
  else if (index === null) {
    len = array.length;
    isNull = true;
  }
  else if (isNumber(index)) {
    index = [index];
    len = 1;
  }
  else {
    throw new TypeError('Unsupported type of index (' + util.object.typeof(index) + ')');
  }

  if (!last) {
    // not the last dimension. recursively run the next dimension
    for (i = 0; i < len; i++) {
      x = isNull ? i : index[i];
      validateIndex(x, array.length);
      subset.push(_getArray(array[x], indexes, dim + 1));
    }
  }
  else {
    // last dimension. get values
    for (i = 0; i < len; i++) {
      x = isNull ? i : index[i];
      validateIndex(x, array.length);
      subset.push(array[x]);
    }
  }

  return subset;
}

/**
 * Recursively replace a subset of a multi dimensional array.
 * Index is not checked for correct number of dimensions.
 * @param {Array} array
 * @param {Array} replacement
 * @param {Array} ranges
 * @param {number} dim
 * @private
 */
function _setIndex (array, replacement, ranges, dim) {
  var range = ranges[dim],
      last = (dim == ranges.length - 1),
      child,
      x, end, step,
      i = 0;

  if (range) {
    // range
    x = range.start;
    end = range.end;
    step = range.step;
  }
  else {
    // all
    x = 0;
    end = array.length;
    step = 1;
  }

  if (!last) {
    // not the last dimension. recursively run the next dimension
    if (step > 0) {
      while (x < end) {
        child = array[x];
        if (!isArray(child)) {
          child = array[x] = [child];
        }
        _setIndex(child, replacement[i], ranges, dim + 1);
        x += step;
        i++;
      }
    }
    else if (step < 0) {
      while (x > end) {
        child = array[x];
        if (!isArray(child)) {
          child = array[x] = [child];
        }
        _setIndex(child, replacement[i], ranges, dim + 1);
        x += step;
        i++;
      }
    }
  }
  else {
    // last dimension. replace values
    if (step > 0) {
      while (x < end) {
        array[x] = replacement[i];
        x += step;
        i++;
      }
    }
    else if (step < 0) {
      while (x > end) {
        array[x] = replacement[i];
        x += step;
        i++;
      }
    }
  }
}

/**
 * Recursively replace a subset of a multi dimensional array.
 * Index is not checked for correct number of dimensions.
 * @param {Array} array
 * @param {Array} replacement
 * @param {Array} indexes
 * @param {number} dim
 * @private
 */
function _setArray (array, replacement, indexes, dim) {
  var subset = [],
      index = indexes[dim],
      len,
      isNull = false,
      last = (dim == indexes.length - 1),
      x, i, child;

  if (isArray(index)) {
    len = index.length;
  }
  else if (index === null) {
    len = array.length;
    isNull = true;
  }
  else if (isNumber(index)) {
    index = [index];
    len = 1;
  }
  else {
    throw new TypeError('Unsupported type of index (' + util.object.typeof(index) + ')');
  }

  if (!last) {
    // not the last dimension. recursively run the next dimension
    for (i = 0; i < len; i++) {
      x = isNull ? i : index[i];
      validateIndex(x);
      child = array[x];
      if (!Array.isArray(child)) {
        child = array[x] = [child];
      }
      _setArray(child, replacement[i], indexes, dim + 1);
    }
  }
  else {
    // last dimension. replace values
    for (i = 0; i < len; i++) {
      x = isNull ? i : index[i];
      validateIndex(x);
      array[x] = replacement[i];
    }
  }

  return subset;
}

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


// exports
module.exports = Index;

// to trick my IDE which doesn't get it
exports.isIndex = Index.isIndex;

util.types.addType('index', Index);
