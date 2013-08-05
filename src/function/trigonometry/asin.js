var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the inverse sine of a value
 *
 *     asin(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseSine.html
 */
module.exports = function asin(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('asin', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    if (x >= -1 && x <= 1) {
      return Math.asin(x);
    }
    else {
      return asin(new Complex(x, 0));
    }
  }

  if (Complex.isComplex(x)) {
    // asin(z) = -i*log(iz + sqrt(1-z^2))
    var re = x.re;
    var im = x.im;
    var temp1 = Complex.create(
        im * im - re * re + 1.0,
        -2.0 * re * im
    );

    var temp2 = sqrt(temp1);
    var temp3;
    if (temp2 instanceof Complex) {
      temp3 = Complex.create(
          temp2.re - im,
          temp2.im + re
      );
    }
    else {
      temp3 = Complex.create(
          temp2 - im,
          re
      );
    }

    var temp4 = log(temp3);

    if (temp4 instanceof Complex) {
      return Complex.create(temp4.im, -temp4.re);
    }
    else {
      return Complex.create(0, -temp4);
    }
  }

  if (collection.isCollection(x)) {
    return collection.map(x, asin);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return asin(x.valueOf());
  }

  throw new error.UnsupportedTypeError('asin', x);
};

// require after module.exports because of possible circular references
var sqrt = require('../arithmetic/sqrt.js'),
    log = require('../arithmetic/log.js');
