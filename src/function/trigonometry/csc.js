var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Calculate the cosecant of a value, csc(x) = 1/sin(x)
 *
 *     csc(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function csc(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('csc', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return 1 / Math.sin(x);
  }

  if (Complex.isComplex(x)) {
    // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
    var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) -
        0.5 * Math.cos(2.0 * x.re);

    return Complex.create (
        0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
        0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
    );
  }

  if (Unit.isUnit(x)) {
    if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
      throw new TypeError ('Unit in function csc is no angle');
    }
    return 1 / Math.sin(x.value);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, csc);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return csc(x.valueOf());
  }

  throw new error.UnsupportedTypeError('csc', x);
};
