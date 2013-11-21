module.exports = function (math, options) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      array = util.array,
      clone = util.object.clone,
      isString = util.string.isString,
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
   * @param {Array | Matrix} size     One dimensional array with numbers
   * @param {Number} [defaultValue]   Undefined by default, except in case of
   *                                  a string, then defaultValue = ' '
   * @return {* | Array | Matrix} res
   */
  math.resize = function resize (x, size, defaultValue) {
    if (arguments.length != 2 && arguments.length != 3) {
      throw new util.error.ArgumentsError('resize', arguments.length, 2, 3);
    }

    var asMatrix = (x instanceof Matrix) ? true : isArray(x) ? false :
        (options.matrix.defaultType !== 'array');

    if (x instanceof Matrix) {
      x = x.valueOf(); // get Array
    }
    if (size instanceof Matrix) {
      size = size.valueOf(); // get Array
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
   * @param {string} char     Default character
   * @private
   */
  function _resizeString(str, size, char) {
    if (char !== undefined) {
      if (!isString(char) || char.length !== 1) {
        throw new TypeError('Single character expected as defaultValue');
      }
    }
    else {
      char = ' ';
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
        res += char;
      }
      return res;
    }
    else {
      return str;
    }
  }
};
