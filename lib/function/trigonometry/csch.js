'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),
      number = util.number,
      
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the hyperbolic cosecant of a value,
   * defined as `csch(x) = 1 / sinh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csch(x)
   *
   * Examples:
   *
   *    // csch(x) = 1/ sinh(x)
   *    math.csch(0.5);       // returns 1.9190347513349437
   *    1 / math.sinh(0.5);   // returns 1.9190347513349437
   *
   * See also:
   *
   *    sinh, sech, coth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic cosecant of x
   */
  math.csch = function csch(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('csch', arguments.length, 1);
    }

    if (isNumber(x)) {
      // x == 0
      if (x == 0) return Number.NaN;
      // consider values close to zero (+/-)
      return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * number.sign(x);
    }

    if (isComplex(x)) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep - en);
      var im = Math.sin(x.im) * (ep + en);
      var den = re * re + im * im;
      return new Complex(2 * re / den, -2 * im /den);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csch is no angle');
      }
      return csch(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, csch);
    }

    if (isBoolean(x) || x === null) {
      return csch(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return csch(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('csch', math['typeof'](x));
  };
};
