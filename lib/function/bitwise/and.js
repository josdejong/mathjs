'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      //BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(53, 131);               // returns Number 1
   *
   *    math.and([1, 12, 31], 42);       // returns Array [0, 8, 10]
   *
   *    var b = math.unit('12 m');
   *    var c = math.unit('12 cm');
   *    var d = math.unit('52 mm');
   *    math.and(c, d);               // returns Unit 48 mm
   *    math.and(b, d);               // returns Unit 32 mm
   *
   * See also:
   *
   *    not, or, xor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to and
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to and
   * @return {Integer | BigNumber | Unit | String | Array | Matrix} AND of `x` and `y`
   */
  math.and = function and(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('and', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (isNaN(x)) {
        throw new Error('Parameter x contains a NaN value');
      }
      if (isNaN(y)) {
        throw new Error('Parameter y contains a NaN value');
      }
      return x & y;
    }

    if (isUnit(x)) {
      if (isUnit(y)) {
        if (x.value == null) {
          throw new Error('Parameter x contains a unit with undefined value');
        }

        if (y.value == null) {
          throw new Error('Parameter y contains a unit with undefined value');
        }

        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        var res = x.clone();
        if (isNumber(res.value) && isNumber(y.value)) {
          var lowBase = math.min(res._bestPrefix()['value'],
                                 y._bestPrefix()['value']);
          var baseChange = math.pow(10, -math.ceil(math.log10(1 / lowBase)));
          res.value /= baseChange;
          res.value &= y.value / baseChange;
          res.value *= baseChange;
          res.fixPrefix = false;
          return res;
        }
      }
    }

    /*if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y) || y === null) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.and(y);
      }

      // downgrade to Number
      return and(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x) || x === null) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.and(y)
      }

      // downgrade to Number
      return and(x, y.toNumber());
    }*/

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, and);
    }

    if (isString(x)) {
      return and((config.number == 'bignumber')
                 ? new BigNumber(x)
                 : parseInt(x), y);
    }
    if (isString(y)) {
      return and(x, (config.number == 'bignumber')
                    ? new BigNumber(y)
                    : parseInt(y));
    }

    if (isBoolean(x) || x === null) {
      return and(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return and(x, +y);
    }

    throw new math.error.UnsupportedTypeError('and', math['typeof'](x), math['typeof'](y));
  };
};
