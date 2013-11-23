module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util.boolean.isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x equals y,
   *
   *     x == y
   *     equal(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.equal = function equal(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('equal', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        return x == y;
      }
      else if (isComplex(y)) {
        return (x == y.re) && (y.im == 0);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return (x.re == y) && (x.im == 0);
      }
      else if (isComplex(y)) {
        return (x.re == y.re) && (x.im == y.im);
      }
    }

    if (x instanceof BigNumber) {
      if (isNumber(y)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        y = toBigNumber(y);
        if (isNumber(y)) {
          return toNumber(x) == y;
        }
      }

      if (y instanceof BigNumber) {
        return x.eq(y);
      }
    }
    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        x = toBigNumber(x);
        if (isNumber(x)) {
          return x == toNumber(y);
        }
      }

      if (x instanceof BigNumber) {
        return x.eq(y)
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
      return x == y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, equal);
    }

    if (isBoolean(x)) {
      return equal(+x, y);
    }
    if (isBoolean(y)) {
      return equal(x, +y);
    }

    throw new util.error.UnsupportedTypeError('equal', x, y);
  };
};
