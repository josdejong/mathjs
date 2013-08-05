var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Calculate the tangent of a value
 *
 *     tan(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Tangent.html
 */
module.exports = function tan(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('tan', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.tan(x);
  }

  if (Complex.isComplex(x)) {
    var den = Math.exp(-4.0 * x.im) +
        2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
        1.0;

    return Complex.create(
        2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
        (1.0 - Math.exp(-4.0 * x.im)) / den
    );
  }

  if (Unit.isUnit(x)) {
    if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
      throw new TypeError ('Unit in function tan is no angle');
    }
    return Math.tan(x.value);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, tan);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return tan(x.valueOf());
  }

  throw new error.UnsupportedTypeError('tan', x);
};
