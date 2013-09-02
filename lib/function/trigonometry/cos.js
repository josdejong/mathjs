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
   * Calculate the cosine of a value
   *
   *     cos(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/Cosine.html
   */
  math.cos = function cos(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cos', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.cos(x);
    }

    if (isComplex(x)) {
      // cos(z) = (exp(iz) + exp(-iz)) / 2
      return new Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cos is no angle');
      }
      return Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.map(x, cos);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cos(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cos', x);
  };
};
