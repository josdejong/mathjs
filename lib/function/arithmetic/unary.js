module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Inverse the sign of a value.
   *
   *     -x
   *     unary(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.unary = function unary(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('unary', arguments.length, 1);
    }

    if (isNumber(x)) {
      return -x;
    }

    if (isComplex(x)) {
      return new Complex(
          -x.re,
          -x.im
      );
    }

    if (x instanceof BigNumber) {
      return x.neg();
    }

    if (isUnit(x)) {
      var res = x.clone();
      res.value = -x.value;
      return res;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, unary);
    }

    if (isBoolean(x)) {
      return -x;
    }

    throw new math.error.UnsupportedTypeError('unary', x);
  };
};
