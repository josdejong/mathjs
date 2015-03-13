'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,

      array = util.array,
      clone = util.object.clone,
      string = util.string,
      isString = util.string.isString,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isArray = array.isArray;

  /**
   * Resize a matrix
   *
   * Syntax:
   *
   *     math.resize(x, size)
   *     math.resize(x, size, defaultValue)
   *
   * Examples:
   *
   *     math.resize([1, 2, 3, 4, 5], [3]); // returns Array  [1, 2, 3]
   *     math.resize([1, 2, 3], [5], 0);    // returns Array  [1, 2, 3, 0, 0]
   *     math.resize(2, [2, 3], 0);         // returns Matrix [[2, 0, 0], [0, 0, 0]]
   *     math.resize("hello", [8], "!");    // returns String 'hello!!!'
   *
   * See also:
   *
   *     size, squeeze, subset
   *
   * @param {* | Array | Matrix} x             Matrix to be resized
   * @param {Array | Matrix} size              One dimensional array with numbers
   * @param {Number | String} [defaultValue=0] Zero by default, except in
   *                                           case of a string, in that case
   *                                           defaultValue = ' '
   * @return {* | Array | Matrix} A resized clone of matrix `x`
   */
  math.resize = function resize (x, size, defaultValue) {
    if (arguments.length != 2 && arguments.length != 3) {
      throw new math.error.ArgumentsError('resize', arguments.length, 2, 3);
    }

    if (size instanceof Matrix) {
      size = size.valueOf(); // get Array
    }

    if (size.length && size[0] instanceof BigNumber) {
      // convert bignumbers to numbers
      size = size.map(function (value) {
        return (value instanceof BigNumber) ? value.toNumber() : value;
      });
    }
    
    // check x is a Matrix
    if (x instanceof Matrix) {
      // use optimized matrix implementation, return copy
      return x.resize(size, defaultValue, true);
    }
    
    if (isString(x)) {
      // resize string
      return _resizeString(x, size, defaultValue);
    }
    
    // check result should be a matrix
    var asMatrix = isArray(x) ? false : (config.matrix !== 'array');

    if (size.length == 0) {
      // output a scalar
      while (isArray(x)) {
        x = x[0];
      }

      return clone(x);
    }
    else {
      // output an array/matrix
      if (!isArray(x)) {
        x = [x];
      }
      x = clone(x);

      var res = array.resize(x, size, defaultValue);
      return asMatrix ? math.matrix(res) : res;
    }
  };

  /**
   * Resize a string
   * @param {String} str
   * @param {Number[]} size
   * @param {string} [defaultChar=' ']
   * @private
   */
  function _resizeString(str, size, defaultChar) {
    if (defaultChar !== undefined) {
      if (!isString(defaultChar) || defaultChar.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      defaultChar = ' ';
    }

    if (size.length !== 1) {
      throw new math.error.DimensionError(size.length, 1);
    }
    var len = size[0];
    if (!isNumber(len) || !isInteger(len)) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }

    if (str.length > len) {
      return str.substring(0, len);
    }
    else if (str.length < len) {
      var res = str;
      for (var i = 0, ii = len - str.length; i < ii; i++) {
        res += defaultChar;
      }
      return res;
    }
    else {
      return str;
    }
  }
};
