module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      Index = require('../../type/Index.js'),

      array = util.array,
      isString = util.string.isString,
      isArray = Array.isArray;

  /**
   * Get or set a subset of a matrix or string
   *
   * Usage:
   *     var subset = math.subset(value, index)               // retrieve subset
   *     var value = math.subset(value, index, replacement)   // replace subset
   *
   * Where:
   *     {Array | Matrix | String} value  An array, matrix, or string
   *     {Index} index                    An index containing ranges for each
   *                                      dimension
   *     {*} replacement                  An array, matrix, or scalar
   *
   * @param args
   * @return res
   */
  math.subset = function subset (args) {
    switch (arguments.length) {
      case 2: // get subset
        return _getSubset(arguments[0], arguments[1]);

      case 3: // set subset
        return _setSubset(arguments[0], arguments[1], arguments[2]);

      default: // wrong number of arguments
        throw new util.error.ArgumentsError('subset', arguments.length, 2, 3);
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
      m = new Matrix(value);
      subset = m.subset(index);
      return subset.valueOf();
    }
    else if (value instanceof Matrix) {
      return value.subset(index);
    }
    else if (isString(value)) {
      return _getSubstring(value, index);
    }
    else {
      throw new util.error.UnsupportedTypeError('subset', value);
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
      throw new RangeError('Dimension mismatch (' + index.size().length + ' != 1)');
    }

    var range = index.range(0);

    var substr = '';
    var strLen = str.length;
    range.forEach(function (v) {
      array.validateIndex(v, strLen);
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
   * @returns {*} result
   * @private
   */
  function _setSubset(value, index, replacement) {
    var m;

    if (isArray(value)) {
      m = new Matrix(math.clone(value));
      m.subset(index, replacement);
      return m.valueOf();
    }
    else if (value instanceof Matrix) {
      return value.clone().subset(index, replacement);
    }
    else if (isString(value)) {
      return _setSubstring(value, index, replacement);
    }
    else {
      throw new util.error.UnsupportedTypeError('subset', value);
    }
  }

  /**
   * Replace a substring in a string
   * @param {String} str            String to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {String} replacement    Replacement string
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement) {
    if (!(index instanceof Index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new RangeError('Dimension mismatch (' + index.size().length + ' != 1)');
    }

    var range = index.range(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new RangeError('Dimension mismatch ' +
          '(' + range.size()[0] + ' != ' + replacement.length + ')');
    }

    // copy the string into an array with characters
    var strLen = str.length;
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      array.validateIndex(v);
      chars[v] = replacement.charAt(i);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = ' ';
        }
      }
    }

    return chars.join('');
  }
};
