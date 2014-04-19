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
   * Calculate the hyperbolic sine of a value
   *
   *     sinh(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/HyperbolicSine.html
   */
  math.sinh = function sinh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sinh', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (Math.exp(x) - Math.exp(-x)) / 2;
    }

    if (isComplex(x)) {
      var cim = Math.cos(x.im);
      var sim = Math.sin(x.im);
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new Complex(cim * (ep - en) / 2, sim * (ep + en) / 2);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sinh is no angle');
      }
      return sinh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sinh);
    }

    if (isBoolean(x)) {
      return sinh(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return sinh(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('sinh', math['typeof'](x));
  };
};
