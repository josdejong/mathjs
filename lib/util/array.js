var number = require('./number'),
    string = require('./string'),
    object = require('./object'),
    types = require('./types'),
    isArray = Array.isArray;

/**
 * Recursively calculate the size of a multi dimensional array.
 * @param {Array} x
 * @Return {Number[]} size
 * @private
 */
function _size(x) {
  if (Array.isArray(x)) {
    var len = x.length;

    var size = len ? _size(x[0]) : [];
    size.unshift(len);
    return size;
  }
  else {
    return [];
  }
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
 * @throws RangeError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new RangeError('Dimension mismatch (' + len + ' != ' + size[dim] + ')');
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new RangeError('Dimension mismatch ' +
            '(' + (size.length - 1) + ' < ' + size.length + ')');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new RangeError('Dimension mismatch ' +
            '(' + (size.length + 1) + ' > ' + size.length + ')');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with the size of each dimension
 * @throws RangeError
 */
exports.validate = function validate(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new RangeError('Dimension mismatch (' + array.length + ' != 0)');
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * @param {*} index         Zero-based index
 * @param {Number} [length] Length of the array
 */
exports.validateIndex = function validateIndex (index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0) {
    throw new RangeError('Index out of range (' + index + ' < 0)');
  }
  if (length !== undefined && index >= length) {
    throw new RangeError('Index out of range (' + index + ' > ' + (length - 1) +  ')');
  }
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
  var i, elem,
      oldLen = array.length,
      newLen = size[dim];

  // apply new length
  array.length = newLen;

  if (dim < size.length - 1) {
    // this is not the last dimension
    var dimNext = dim + 1;

    for (i = 0; i < Math.min(oldLen, newLen); i++) {
      // change element into an array when needed
      elem = array[i];
      if (!Array.isArray(elem)) {
        elem = (i in array) ? [elem] : []; // ensure we have an initialized value
        array[i] = elem;
      }

      _resize(elem, size, dimNext, defaultValue);
    }

    for (i = oldLen; i < newLen; i++) {
      // create new array
      elem = [];
      array[i] = elem;

      _resize(elem, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension
    for (i = 0; i < Math.min(oldLen, newLen); i++) {
      // squeeze array into a scalar when needed
      elem = array[i];
      if (Array.isArray(elem)) {
        while (Array.isArray(elem)) {
          elem = elem[0];
        }
        array[i] = elem;
      }
    }

    // fill new elements with the default value
    if(defaultValue !== undefined) {
      for (i = oldLen; i < newLen; i++) {
        array[i] = object.clone(defaultValue);
      }
    }
  }
}

/**
 * Resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {Array.<Number>} size Array with the size of each dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              undefined by default
 */
exports.resize = function resize(array, size, defaultValue) {
  // TODO: what to do with scalars, when size=[] ?

  // check the type of the arguments
  if (!Array.isArray(array) || !Array.isArray(size)) {
    throw new TypeError('Array expected');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  // recursively resize the array
  _resize(array, size, 0, defaultValue);
};

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
 * Test whether an object is an array
 * @param {*} value
 * @return {Boolean} isArray
 */
exports.isArray = Array.isArray;