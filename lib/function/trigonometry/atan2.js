module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      toNumber = util.number.toNumber,
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
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }
    else if (isComplex(y)) {
      if (isNumber(x)) {
        return Math.atan2(y.re, x);
      }
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }

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
      return atan2(toNumber(y), x);
    }
    if (x instanceof BigNumber) {
      return atan2(y, toNumber(x));
    }

    throw new math.error.UnsupportedTypeError('atan2', y, x);
  };
};
