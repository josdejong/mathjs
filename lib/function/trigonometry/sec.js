module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the secant of a value, sec(x) = 1/cos(x)
   *
   *     sec(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sec = function sec(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sec', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 1 / Math.cos(x);
    }

    if (isComplex(x)) {
      // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
      var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
          0.5 * Math.cos(2.0 * x.re);
      return new Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
          0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sec is no angle');
      }
      return 1 / Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.map(x, sec);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sec(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sec', x);
  };
};
