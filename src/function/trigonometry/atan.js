var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the inverse tangent of a value
 *
 *     atan(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
module.exports = function atan(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('atan', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.atan(x);
  }

  if (Complex.isComplex(x)) {
    // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
    var re = x.re;
    var im = x.im;
    var den = re * re + (1.0 - im) * (1.0 - im);

    var temp1 = Complex.create(
        (1.0 - im * im - re * re) / den,
        (-2.0 * re) / den
    );
    var temp2 = log(temp1);

    if (temp2 instanceof Complex) {
      return Complex.create(
          -0.5 * temp2.im,
          0.5 * temp2.re
      );
    }
    else {
      return Complex.create(
          0,
          0.5 * temp2
      );
    }
  }

  if (collection.isCollection(x)) {
    return collection.map(x, atan);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return atan(x.valueOf());
  }

  throw new error.UnsupportedTypeError('atan', x);
};

// require after module.exports because of possible circular references
var log = require('../arithmetic/log.js');
