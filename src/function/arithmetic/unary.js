var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Inverse the sign of a value.
 *
 *     -x
 *     unary(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
module.exports = function unary(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('unary', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return -x;
  }
  else if (Complex.isComplex(x)) {
    return Complex.create(
        -x.re,
        -x.im
    );
  }
  else if (Unit.isUnit(x)) {
    var res = x.clone();
    res.value = -x.value;
    return res;
  }

  if (collection.isCollection(x)) {
    return collection.map(x, unary);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return unary(x.valueOf());
  }

  throw new error.UnsupportedTypeError('unary', x);
};
