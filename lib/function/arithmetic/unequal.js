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

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        return x != y;
      }
      else if (isComplex(y)) {
        return (x != y.re) || (y.im != 0);
      }
    }

    if (isComplex(x)) {
      if (isNumBool(y)) {
        return (x.re != y) || (x.im != 0);
      }
      else if (isComplex(y)) {
        return (x.re != y.re) || (x.im != y.im);
      }
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber || isNumber(y)) {
        return !x.eq(y);
      }
      else if (isBoolean(y)) {
        return !x.eq(Number(y));
      }
    }
    else if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return !y.eq(x);
      }
      else if (isBoolean(x)) {
        return !y.eq(Number(x));
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

    throw new util.error.UnsupportedTypeError('unequal', x, y);
  };
};
