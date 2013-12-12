module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the absolute value of a value.
   *
   *     abs(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.abs = function abs(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('abs', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.abs(x);
    }

    if (isComplex(x)) {
      return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (x instanceof BigNumber) {
      return x.abs();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, abs);
    }

    if (isBoolean(x)) {
      return Math.abs(x);
    }

    throw new math.error.UnsupportedTypeError('abs', x);
  };
};
