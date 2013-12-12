module.exports = function (math, settings) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Matrix = require('../../type/Matrix'),

      array = util.array,
      clone = util.object.clone,
      isString = util.string.isString,
      toNumber = util.number.toNumber,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isArray = array.isArray;

  /**
   * Resize a matrix
   *
   *     resize(x, size)
   *     resize(x, size, defaultValue)
   *
   * @param {* | Array | Matrix} x
   * @param {Array | Matrix} size             One dimensional array with numbers
   * @param {Number | String} [defaultValue]  Undefined by default, except in
   *                                          case of a string, in that case
   *                                          defaultValue = ' '
   * @return {* | Array | Matrix} res
   */
  math.resize = function resize (x, size, defaultValue) {
    if (arguments.length != 2 && arguments.length != 3) {
      throw new math.error.ArgumentsError('resize', arguments.length, 2, 3);
    }

    var asMatrix = (x instanceof Matrix) ? true : isArray(x) ? false : (settings.matrix !== 'array');

    if (x instanceof Matrix) {
      x = x.valueOf(); // get Array
    }
    if (size instanceof Matrix) {
      size = size.valueOf(); // get Array
    }

    if (size.length && size[0] instanceof BigNumber) {
      // convert bignumbers to numbers
      size = size.map(toNumber);
    }

    if (isString(x)) {
      return _resizeString(x, size, defaultValue);
    }
    else {
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
        return asMatrix ? new Matrix(res) : res;
      }
    }
  };

  /**
   * Resize a string
   * @param {String} str
   * @param {Number[]} size
   * @param {string} defaultChar
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
      throw new Error('Dimension mismatch: (' + size.length + ' != 1)');
    }
    var len = size[0];
    if (!isNumber(len) || !isInteger(len)) {
      throw new TypeError('Size must contain numbers');
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
