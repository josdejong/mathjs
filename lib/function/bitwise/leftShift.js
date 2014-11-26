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
   * Bitwise left logical shift one value by another values, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2);               // returns Number 4
   *
   *    math.leftShift([1, 2, 3], 4);       // returns Array [16, 32, 64]
   *
   *    var c = math.unit('12 cm');
   *    var d = math.unit('52 mm');
   *    math.leftShift(c, 2);               // returns Unit 48 cm
   *    math.leftShift(b, 2);               // returns Unit 208 mm
   *
   * See also:
   *
   *    and, not, or, xor, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | String | null} y Amount of shifts
   * @return {Integer | BigNumber | Unit | Array | Matrix} `x` shifted left `y` times
   */
  math.leftShift = function leftShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('leftShift', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (isNaN(x)) {
        throw new Error('Parameter x contains a NaN value');
      }
      if (isNaN(y)) {
        throw new Error('Parameter y contains a NaN value');
      }
      return x << y;
    }

    /*if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (y === null) {
        y = new BigNumber(0);
      }

      if (y instanceof BigNumber) {
        return x.leftShift(y);
      }

      // downgrade to Number
      return leftShift(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }

      if (x instanceof BigNumber) {
        return x.leftShift(y);
      }

      // downgrade to Number
      return leftShift(x, y.toNumber());
    }*/

    if (isUnit(x)) {
      if (isNumber(y)) {
        if (x.value == null) {
          throw new Error('Parameter x contains a unit with undefined value');
        }

        var res = x.clone();
        if (isNumber(res.value)) {
          var baseChange = res.prefix['value'];
          res.value = ((res.value / baseChange) << y) * baseChange;
          res.fixPrefix = false;
          return res;
        }
      }
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, leftShift);
    }

    if (isString(x)) {
      return leftShift((config.number == 'bignumber')
                       ? new BigNumber(x)
                       : parseInt(x), y);
    }
    if (isString(y)) {
      return leftShift(x, (config.number == 'bignumber')
                          ? new BigNumber(y)
                          : parseInt(y));
    }

    if (isBoolean(x) || x === null) {
      return leftShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return leftShift(x, +y);
    }

    throw new math.error.UnsupportedTypeError('leftShift', math['typeof'](x), math['typeof'](y));
  };
};
