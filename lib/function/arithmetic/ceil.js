module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
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
      throw new util.error.ArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumBool(x)) {
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

    throw new util.error.UnsupportedTypeError('ceil', x);
  };
};
