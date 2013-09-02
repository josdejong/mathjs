module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is larger or equal to y
   *
   *     x >= y
   *     largereq(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.largereq = function largereq(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        return x >= y;
      }
      else if (isComplex(y)) {
        return x >= math.abs(y);
      }
    }
    if (isComplex(x)) {
      if (isNumBool(y)) {
        return math.abs(x) >= y;
      }
      else if (isComplex(y)) {
        return math.abs(x) >= math.abs(y);
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value >= y.value;
    }

    if (isString(x) || isString(y)) {
      return x >= y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.map2(x, y, largereq);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return largereq(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('largereq', x, y);
  };
};
