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
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(1, 2);               // returns Number 3
   *
   *    math.xor([2, 3, 4], 4);       // returns Array [6, 7, 0]
   *
   *    var b = math.unit('12 m');
   *    var c = math.unit('12 cm');
   *    var d = math.unit('52 mm');
   *    math.xor(c, d);               // returns Unit 76 mm
   *    math.xor(b, d);               // returns Unit 11.988 m
   *
   * See also:
   *
   *    and, not, or, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to xor
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to xor
   * @return {Integer | BigNumber | Unit | String | Array | Matrix} XOR of `x` and `y`
   */
  math.xor = function xor(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('xor', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
        return x ^ y;
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
          res.value ^= y.value / baseChange;
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
        return x.xor(y);
      }

      // downgrade to Number
      return xor(x.toNumber(), y);
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
        return x.xor(y)
      }

      // downgrade to Number
      return xor(x, y.toNumber());
    }*/

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, xor);
    }

    if (isString(x)) {
      return xor((config.number == 'bignumber')
                 ? new BigNumber(x)
                 : parseInt(x), y);
    }
    if (isString(y)) {
      return xor(x, (config.number == 'bignumber')
                    ? new BigNumber(y)
                    : parseInt(y));
    }

    if (isBoolean(x) || x === null) {
      return xor(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return xor(x, +y);
    }

    throw new math.error.UnsupportedTypeError('xor', math['typeof'](x), math['typeof'](y));
  };
};
