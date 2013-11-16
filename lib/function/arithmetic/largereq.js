module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isNumBool = util.number.isNumBool,
      isBoolean = util.boolean.isBoolean,
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
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.largereq = function largereq(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x >= y;
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber || isNumber(y)) {
        return x.gte(y);
      }
      else if (isBoolean(y)) {
        return x.gte(Number(y));
      }
    }
    else if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return y.gte(x);
      }
      else if (isBoolean(x)) {
        return y.gte(Number(x));
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
      return collection.deepMap2(x, y, largereq);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    throw new util.error.UnsupportedTypeError('largereq', x, y);
  };
};
