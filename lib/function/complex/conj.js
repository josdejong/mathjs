module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      object = util.object,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the complex conjugate of a complex value.
   * If x = a+bi, the complex conjugate is a-bi.
   *
   *     conj(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.conj = function conj(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('conj', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x;
    }

    if (x instanceof BigNumber) {
      return new BigNumber(x);
    }

    if (isComplex(x)) {
      return new Complex(x.re, -x.im);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, conj);
    }

    if (isBoolean(x)) {
      return +x;
    }

    // return a clone of the value for non-complex values
    return object.clone(x);
  };
};
