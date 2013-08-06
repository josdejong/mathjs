var math = require('../../math.js'),
    util = require('../../util/index.js'),

    Complex = require('../../type/Complex.js').Complex,
    collection = require('../../type/collection.js'),

    isNumber = util.number.isNumber,
    isComplex = Complex.isComplex,
    isCollection = collection.isCollection;

/**
 * Round a value towards minus infinity
 *
 *     floor(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.floor = function floor(x) {
  if (arguments.length != 1) {
    throw new util.error.ArgumentsError('floor', arguments.length, 1);
  }

  if (isNumber(x)) {
    return Math.floor(x);
  }

  if (isComplex(x)) {
    return Complex.create (
        Math.floor(x.re),
        Math.floor(x.im)
    );
  }

  if (isCollection(x)) {
    return collection.map(x, floor);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return floor(x.valueOf());
  }

  throw new util.error.UnsupportedTypeError('floor', x);
};
