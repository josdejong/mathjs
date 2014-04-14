module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Computes the principal value of the arc tangent of y/x in radians
   *
   *     atan2(y, x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} y
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseTangent.html
   */
  math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
      if (isNumber(x)) {
        return Math.atan2(y, x);
      }
    }

    // TODO: support for complex computation of atan2

    if (isCollection(y) || isCollection(x)) {
      return collection.deepMap2(y, x, atan2);
    }

    if (isBoolean(y)) {
      return atan2(+y, x);
    }
    if (isBoolean(x)) {
      return atan2(y, +x);
    }

    // TODO: implement bignumber support
    if (y instanceof BigNumber) {
      return atan2(y.toNumber(), x);
    }
    if (x instanceof BigNumber) {
      return atan2(y, x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('atan2', math['typeof'](y), math['typeof'](x));
  };
};
