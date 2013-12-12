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
   * Round a value towards zero
   *
   *     fix(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.fix = function fix(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.isNegative() ? x.ceil() : x.floor();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, fix);
    }

    if (isBoolean(x)) {
      return fix(+x);
    }

    throw new math.error.UnsupportedTypeError('fix', x);
  };
};
