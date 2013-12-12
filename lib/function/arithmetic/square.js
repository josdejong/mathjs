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
   * Compute the square of a value
   *
   *     x .* x
   *     square(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.square = function square(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x * x;
    }

    if (isComplex(x)) {
      return math.multiply(x, x);
    }

    if (x instanceof BigNumber) {
      return x.times(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, square);
    }

    if (isBoolean(x)) {
      return x * x;
    }

    throw new math.error.UnsupportedTypeError('square', x);
  };
};
