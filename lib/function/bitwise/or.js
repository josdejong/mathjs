'use strict';

module.exports = function (math) {
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
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.or(x, y)
   *
   * Examples:
   *
   *    math.or(1, 2);               // returns Number 3
   *
   *    math.or([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var b = math.unit('12 m');
   *    var c = math.unit('12 cm');
   *    var d = math.unit('52 mm');
   *    math.or(c, d);               // returns Unit 124 mm
   *    math.or(b, d);               // returns Unit 12.02 m
   *
   * See also:
   *
   *    and, not, xor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to or
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to or
   * @return {Integer | BigNumber | Unit | String | Array | Matrix} OR of `x` and `y`
   */
  math.or = function or(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('or', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
        return x | y;
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
          res.value |= y.value / baseChange;
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
        return x.or(y);
      }

      // downgrade to Number
      return or(x.toNumber(), y);
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
        return x.or(y)
      }

      // downgrade to Number
      return or(x, y.toNumber());
    }*/

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, or);
    }

    if (isString(x)) {
      return or((config.number == 'bignumber')
                ? new BigNumber(x)
                : parseInt(x), y);
    }
    if (isString(y)) {
      return or(x, (config.number == 'bignumber')
                   ? new BigNumber(y)
                   : parseInt(y));
    }

    if (isBoolean(x) || x === null) {
      return or(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return or(x, +y);
    }

    throw new math.error.UnsupportedTypeError('or', math['typeof'](x), math['typeof'](y));
  };
};
