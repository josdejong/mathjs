module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection = collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the argument of a complex value.
   * If x = a + bi, the argument is computed as atan2(b, a).
   *
   *     arg(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} res
   */
  math.arg = function arg(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('arg', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.atan2(0, x);
    }

    if (isComplex(x)) {
      return Math.atan2(x.im, x.re);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, arg);
    }

    if (isBoolean(x)) {
      return arg(+x);
    }

    if (x instanceof BigNumber) {
      // downgrade to Number
      // TODO: implement BigNumber support
      return arg(util.number.toNumber(x));
    }

    throw new math.error.UnsupportedTypeError('arg', x);
  };
};
