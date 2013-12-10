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
   * Compute the cube of a value
   *
   *     x .* x .* x
   *     cube(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.cube = function cube(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x * x * x;
    }

    if (isComplex(x)) {
      return math.multiply(math.multiply(x, x), x);
    }

    if (x instanceof BigNumber) {
      return x.times(x).times(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cube);
    }

    if (isBoolean(x)) {
      return cube(+x);
    }

    throw new math.error.UnsupportedTypeError('cube', x);
  };
};
