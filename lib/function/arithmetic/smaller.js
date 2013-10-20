module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is smaller y
   *
   *     x < y
   *     smaller(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.smaller = function smaller(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('smaller', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x < y;
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value < y.value;
    }

    if (isString(x) || isString(y)) {
      return x < y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, smaller);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return smaller(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('smaller', x, y);
  };
};
