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
   * Check if value x unequals y, x != y
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.unequal = function unequal(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        return x != y;
      }
      else if (isComplex(y)) {
        return (x != y.re) || (y.im != 0);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return (x.re != y) || (x.im != 0);
      }
      else if (isComplex(y)) {
        return (x.re != y.re) || (x.im != y.im);
      }
    }

    if (x instanceof BigNumber) {
      if (isNumber(y)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        y = toBigNumber(y);
        if (isNumber(y)) {
          return toNumber(x) != y;
        }
      }

      if (y instanceof BigNumber) {
        return !x.eq(y);
      }
    }
    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        x = toBigNumber(x);
        if (isNumber(x)) {
          return x != toNumber(y);
        }
      }

      if (x instanceof BigNumber) {
        return !x.eq(y)
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value != y.value;
    }

    if (isString(x) || isString(y)) {
      return x != y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, unequal);
    }

    if (isBoolean(x)) {
      return unequal(+x, y);
    }
    if (isBoolean(y)) {
      return unequal(x, +y);
    }

    throw new util.error.UnsupportedTypeError('unequal', x, y);
  };
};
