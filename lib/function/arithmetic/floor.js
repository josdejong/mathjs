module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards minus infinity
   *
   *     floor(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.floor = function floor(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('floor', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.floor(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.floor(x.re),
          Math.floor(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.floor();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, floor);
    }

    if (isBoolean(x)) {
      return floor(+x);
    }

    throw new math.error.UnsupportedTypeError('floor', x);
  };
};
