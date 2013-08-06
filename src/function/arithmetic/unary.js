var math = require('../../math.js'),
    util = require('../../util/index.js'),

    Complex = require('../../type/Complex.js').Complex,
    Unit = require('../../type/Unit.js').Unit,
    collection = require('../../type/collection.js'),

    isNumber = util.number.isNumber,
    isComplex = Complex.isComplex,
    isUnit = Unit.isUnit,
    isCollection = collection.isCollection;

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
math.unary = function unary(x) {
  if (arguments.length != 1) {
    throw new util.error.ArgumentsError('unary', arguments.length, 1);
  }

  if (isNumber(x)) {
    return -x;
  }
  else if (isComplex(x)) {
    return Complex.create(
        -x.re,
        -x.im
    );
  }
  else if (isUnit(x)) {
    var res = x.clone();
    res.value = -x.value;
    return res;
  }

  if (isCollection(x)) {
    return collection.map(x, unary);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return unary(x.valueOf());
  }

  throw new util.error.UnsupportedTypeError('unary', x);
};
