var number = require('./number'),
    string = require('./string'),
    object = require('./object'),
    types = require('./types'),

    DimensionError = require('../error/DimensionError'),
    IndexError = require('../error/IndexError'),

    isArray = Array.isArray;

/**
 * Calculate the size of a multi dimensional array.
 * @param {Array} x
 * @Return {Number[]} size
 * @private
 */
function _size(x) {
  var size = [];

  while (isArray(x)) {
    size.push(x.length);
    x = x[0];
  }

  return size;
}

/**
 * Calculate the size of a multi dimensional array.
 * All elements in the array are checked for matching dimensions using the
 * method validate
 * @param {Array} x
 * @Return {Number[]} size
 * @throws RangeError
 */
exports.size = function size (x) {
  // calculate the size
  var s = _size(x);

  // verify the size
  exports.validate(x, s);
  // TODO: don't validate here? only in a Matrix constructor?

  return s;
};

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with the size of each dimension
 * @param {Number} dim   Current dimension
 * @throws DimensionError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new DimensionError(len, size[dim]);
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!isArray(child)) {
        throw new DimensionError(size.length - 1, size.length, '<');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (isArray(array[i])) {
        throw new DimensionError(size.length + 1, size.length, '>');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with the size of each dimension
 * @throws DimensionError
 */
exports.validate = function validate(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (isArray(array)) {
      throw new DimensionError(array.length, 0);
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * @param {Number} index    Zero-based index
 * @param {Number} [length] Length of the array
 */
exports.validateIndex = function validateIndex (index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0) {
    throw new IndexError(index);
  }
  if (length !== undefined && index >= length) {
    throw new IndexError(index, length);
  }
};

/**
 * Resize a multi dimensional array. The resized array is returned.
 * @param {Array} array         Array to be resized
 * @param {Array.<Number>} size Array with the size of each dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default
 * @return {Array} array         The resized array
 */
exports.resize = function resize(array, size, defaultValue) {
  // TODO: add support for scalars, having size=[] ?

  // check the type of the arguments
  if (!isArray(array) || !isArray(size)) {
    throw new TypeError('Array expected');
  }
  if (size.length === 0) {
    throw new Error('Resizing to scalar is not supported');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  // count the current number of dimensions
  var dims = 1;
  var elem = array[0];
  while (isArray(elem)) {
    dims++;
    elem = elem[0];
  }

  // adjust the number of dimensions when needed
  while (dims < size.length) { // add dimensions
    array = [array];
    dims++;
  }
  while (dims > size.length) { // remove dimensions
    array = array[0];
    dims--;
  }

  // recursively resize the array
  _resize(array, size, 0, defaultValue);

  return array;
};

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {Number[]} size       Array with the size of each dimension
 * @param {Number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  if (!isArray(array)) throw Error('Array expected');

  var i, elem,
      oldLen = array.length,
      newLen = size[dim],
      minLen = Math.min(oldLen, newLen);

  // apply new length
  array.length = newLen;

  if (dim < size.length - 1) {
    // non-last dimension
    var dimNext = dim + 1;

    // resize existing child arrays
    for (i = 0; i < minLen; i++) {
      // resize child array
      elem = array[i];
      _resize(elem, size, dimNext, defaultValue);
    }

    // create new child arrays
    for (i = minLen; i < newLen; i++) {
      // get child array
      elem = [];
      array[i] = elem;

      // resize new child array
      _resize(elem, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension
    if(defaultValue !== undefined) {
      // fill new elements with the default value
      for (i = oldLen; i < newLen; i++) {
        array[i] = object.clone(defaultValue);
      }
    }
  }
}

/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @return {Array} array
 * @private
 */
exports.squeeze = function squeeze(array) {
  while(isArray(array) && array.length === 1) {
    array = array[0];
  }

  return array;
};

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 * @param {Array} array
 * @param {Number} dims   Number of desired dimensions
 * @return {Array} array
 * @private
 */
exports.unsqueeze = function unsqueeze(array, dims) {
  var size = exports.size(array);

  for (var i = 0, ii = (dims - size.length); i < ii; i++) {
    array = [array];
  }

  return array;
};

/**
 * Flatten a multi dimensional array, put all elements in a one dimensional
 * array
 * @param {Array} array   A multi dimensional array
 * @return {Array}        The flattened array (1 dimensional)
 * @private
 */
exports.flatten = function flatten(array) {
  var flat = array,
      isArray = Array.isArray;

  while (isArray(flat[0])) {
    var next = [];
    for (var i = 0, ii = flat.length; i < ii; i++) {
      next = next.concat.apply(next, flat[i]);
    }
    flat = next;
  }

  return flat;
};

/**
 * Test whether an object is an array
 * @param {*} value
 * @return {Boolean} isArray
 */
exports.isArray = isArray;