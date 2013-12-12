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
   * Calculate the sine of a value
   *
   *     sin(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/Sine.html
   */
  math.sin = function sin(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sin', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.sin(x);
    }

    if (isComplex(x)) {
      return new Complex(
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
          0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sin is no angle');
      }
      return Math.sin(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sin);
    }

    if (isBoolean(x)) {
      return Math.sin(x);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return sin(util.number.toNumber(x));
    }

    throw new math.error.UnsupportedTypeError('sin', x);
  };
};
