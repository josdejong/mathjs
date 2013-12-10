module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Round a value towards plus infinity
   *
   *     ceil(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.ceil = function ceil(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.ceil(x.re),
          Math.ceil(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.ceil();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, ceil);
    }

    if (isBoolean(x)) {
      return Math.ceil(x);
    }

    throw new math.error.UnsupportedTypeError('ceil', x);
  };
};
