'use strict';

module.exports = function (math, config) {

  var util = require('../../util/index'),

      Matrix = math.type.Matrix,
      Index = require('../../type/Index'),

      array = util.array,
      isString = util.string.isString,
      isArray = Array.isArray;

  /**
   * Get or set a subset of a matrix or string.
   *
   * Syntax:
   *     math.subset(value, index)                                // retrieve a subset
   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
   *
   * Examples:
   *
   *     // get a subset
   *     var d = [[1, 2], [3, 4]];
   *     math.subset(d, math.index(1, 0));        // returns 3
   *     math.subset(d, math.index([0, 2], 1));   // returns [[2], [4]]
   *
   *     // replace a subset
   *     var e = [];
   *     var f = math.subset(e, math.index(0, [0, 2]), [5, 6]);  // f = [[5, 6]]
   *     var g = math.subset(f, math.index(1, 1), 7, 0);         // g = [[5, 6], [0, 7]]
   *
   * See also:
   *
   *     size, resize, squeeze, index
   *
   * @param {Array | Matrix | String} matrix  An array, matrix, or string
   * @param {Index} index                     An index containing ranges for each
   *                                          dimension
   * @param {*} [replacement]                 An array, matrix, or scalar.
   *                                          If provided, the subset is replaced with replacement.
   *                                          If not provided, the subset is returned
   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
   *                                          the matrix is resized. If not provided,
   *                                          math.matrix elements will be left undefined.
   * @return {Array | Matrix | String} Either the retrieved subset or the updated matrix.
   */
  math.subset = function subset (matrix, index, replacement, defaultValue) {
    switch (arguments.length) {
      case 2: // get subset
        return _getSubset(arguments[0], arguments[1]);

      // intentional fall through
      case 3: // set subset
      case 4: // set subset with default value
        return _setSubset(arguments[0], arguments[1], arguments[2], arguments[3]);

      default: // wrong number of arguments
        throw new math.error.ArgumentsError('subset', arguments.length, 2, 4);
    }
  };

  /**
   * Retrieve a subset of an value such as an Array, Matrix, or String
   * @param {Array | Matrix | String} value Object from which to get a subset
   * @param {Index} index                   An index containing ranges for each
   *                                        dimension
   * @returns {Array | Matrix | *} subset
   * @private
   */
  function _getSubset(value, index) {
    var m, subset;

    if (isArray(value)) {
      m = math.matrix(value);
      subset = m.subset(index);           // returns a Matrix
      return subset && subset.valueOf();  // return an Array (like the input)
    }
    else if (value instanceof Matrix) {
      return value.subset(index);
    }
    else if (isString(value)) {
      return _getSubstring(value, index);
    }
    else {
      throw new math.error.UnsupportedTypeError('subset', math['typeof'](value));
    }
  }

  /**
   * Retrieve a subset of a string
   * @param {String} str            String from which to get a substring
   * @param {Index} index           An index containing ranges for each dimension
   * @returns {string} substring
   * @private
   */
  function _getSubstring(str, index) {
    if (!(index instanceof Index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new math.error.DimensionError(index.size().length, 1);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    array.validateIndex(index.min()[0], strLen);
    array.validateIndex(index.max()[0], strLen);

    var range = index.range(0);

    var substr = '';
    range.forEach(function (v) {
      substr += str.charAt(v);
    });

    return substr;
  }

  /**
   * Replace a subset in an value such as an Array, Matrix, or String
   * @param {Array | Matrix | String} value Object to be replaced
   * @param {Index} index                   An index containing ranges for each
   *                                        dimension
   * @param {Array | Matrix | *} replacement
   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
   *                                  the matrix is resized. If not provided,
   *                                  math.matrix elements will be filled with zeros.
   * @returns {*} result
   * @private
   */
  function _setSubset(value, index, replacement, defaultValue) {
    var m;

    if (isArray(value)) {
      m = math.matrix(math.clone(value));
      m.subset(index, replacement, defaultValue);
      return m.valueOf();
    }
    else if (value instanceof Matrix) {
      return value.clone().subset(index, replacement, defaultValue);
    }
    else if (isString(value)) {
      return _setSubstring(value, index, replacement, defaultValue);
    }
    else {
      throw new math.error.UnsupportedTypeError('subset', math['typeof'](value));
    }
  }

  /**
   * Replace a substring in a string
   * @param {String} str            String to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {String} replacement    Replacement string
   * @param {String} [defaultValue] Default value to be uses when resizing
   *                                the string. is ' ' by default
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement, defaultValue) {
    if (!(index instanceof Index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new math.error.DimensionError(index.size().length, 1);
    }
    if (defaultValue !== undefined) {
      if (!isString(defaultValue) || defaultValue.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultValue = ' ';
    }

    var range = index.range(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new math.error.DimensionError(range.size()[0], replacement.length);
    }

    // validate whether the range is out of range
    var strLen = str.length;
    array.validateIndex(index.min()[0]);
    array.validateIndex(index.max()[0]);

    // copy the string into an array with characters
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      chars[v] = replacement.charAt(i);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = defaultValue;
        }
      }
    }

    return chars.join('');
  }
};
