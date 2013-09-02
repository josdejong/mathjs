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
   * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x)
   *
   *     cot(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.cot = function cot(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cot', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 1 / Math.tan(x);
    }

    if (isComplex(x)) {
      var den = Math.exp(-4.0 * x.im) -
          2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

      return new Complex(
          2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
          (Math.exp(-4.0 * x.im) - 1.0) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return 1 / Math.tan(x.value);
    }

    if (isCollection(x)) {
      return collection.map(x, cot);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cot(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cot', x);
  };
};
