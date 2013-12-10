module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is larger y
   *
   *    x > y
   *    larger(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.larger = function larger(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('larger', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return x > y;
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.gt(y);
      }

      // downgrade to Number
      return larger(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.gt(y)
      }

      // downgrade to Number
      return larger(x, toNumber(y));
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value > y.value;
    }

    if (isString(x) || isString(y)) {
      return x > y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, larger);
    }

    if (isBoolean(x)) {
      return larger(+x, y);
    }
    if (isBoolean(y)) {
      return larger(x, +y);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    throw new math.error.UnsupportedTypeError('larger', x, y);
  };
};
