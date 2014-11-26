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
   * Bitwise NOT value, `~x`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.not(x)
   *
   * Examples:
   *
   *    math.not(1);               // returns Number -2
   *
   *    math.not([2, -3, 4]);       // returns Array [-3, 2, 5]
   *
   *    var c = math.unit('-12 m');
   *    var d = math.unit('52 mm');
   *    math.not(c);               // returns Unit 11 m
   *    math.not(d);               // returns Unit -53 mm
   *
   * See also:
   *
   *    and, or, xor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x Value to not 
   * @return {Integer | BigNumber | Unit | String | Array | Matrix} NOT of `x`
   */
  math.not = function not(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('not', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (isNaN(x)) {
        throw new Error('Parameter x contains a NaN value');
      }
      return ~x;
    }

    if (isUnit(x)) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      var res = x.clone();
      if (isNumber(res.value)) {
        var baseChange = res.prefix['value'];
        res.value = ~(res.value / baseChange) * baseChange;
        res.fixPrefix = false;
        return res;
      }
    }

    /*if (x instanceof BigNumber) {
      return x.not();
    }*/

    if (isCollection(x)) {
      return collection.deepMap(x, not);
    }

    if (isString(x)) {
      return not((config.number == 'bignumber')
                 ? new BigNumber(x)
                 : parseInt(x));
    }

    if (isBoolean(x) || x === null) {
      return not(+x);
    }

    throw new math.error.UnsupportedTypeError('not', math['typeof'](x));
  };
};
