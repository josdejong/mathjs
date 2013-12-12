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
   * Get the imaginary part of a complex number.
   *
   *     im(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean} x
   * @return {Number | BigNumber | Array | Matrix} im
   */
  math.im = function im(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 0;
    }

    if (x instanceof BigNumber) {
      return new BigNumber(0);
    }

    if (isComplex(x)) {
      return x.im;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, im);
    }

    if (isBoolean(x)) {
      return 0;
    }

    // return 0 for all non-complex values
    return 0;
  };
};
