var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Calculate the cosine of a value
 *
 *     cos(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/Cosine.html
 */
module.exports = function cos(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('cos', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.cos(x);
  }

  if (Complex.isComplex(x)) {
    // cos(z) = (exp(iz) + exp(-iz)) / 2
    return Complex.create(
        0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
        0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
    );
  }

  if (Unit.isUnit(x)) {
    if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
      throw new TypeError ('Unit in function cos is no angle');
    }
    return Math.cos(x.value);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, cos);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return cos(x.valueOf());
  }

  throw new error.UnsupportedTypeError('cos', x);
};
