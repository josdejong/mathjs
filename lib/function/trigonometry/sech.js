module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the hyperbolic secant of a value; sech(x)=1/cosh(x)
   *
   *     sech(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/HyperbolicSecant.html
   */
  math.sech = function sech(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sech', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 2 / (Math.exp(x) + Math.exp(-x));
    }

    if (isComplex(x)) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep + en);
      var im = Math.sin(x.im) * (ep - en);
      var den = re * re + im * im;
      return new Complex(2 * re / den, -2 * im / den);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sech is no angle');
      }
      return sech(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sech);
    }

    if (isBoolean(x)) {
      return sech(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return sech(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('sech', math['typeof'](x));
  };
};
