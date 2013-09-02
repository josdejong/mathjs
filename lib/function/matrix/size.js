module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Unit = require('../../type/Unit.js'),
      Matrix = require('../../type/Matrix.js'),

      array = util.array,
      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit;

  /**
   * Calculate the size of a matrix or scalar
   *
   *     size(x)
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.size = function size (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('size', arguments.length, 1);
    }

    if (isNumber(x) || isComplex(x) || isUnit(x) || isBoolean(x) || x == null) {
      return [];
    }

    if (isString(x)) {
      return [x.length];
    }

    if (Array.isArray(x)) {
      return array.size(x);
    }

    if (x instanceof Matrix) {
      return new Matrix(x.size());
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return size(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('size', x);
  };
};
