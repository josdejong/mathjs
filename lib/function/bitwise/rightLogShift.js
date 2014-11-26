'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Bitwise right logical shift one value by another values, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2);               // returns Number 1
   *
   *    math.rightLogShift([16, -32, 64], 4);   // returns Array [1, 2, 3]
   *
   *    var c = math.unit('12 cm');
   *    var d = math.unit('52 mm');
   *    math.rightArithShift(c, 2);               // returns Unit 30 mm
   *    math.rightArithShift(b, 2);               // returns Unit 13 mm
   *
   * See also:
   *
   *    and, not, or, xor, leftShift, rightArithShift
   *
   * @param  {Number | Boolean | Unit | String | Array | Matrix | null} x Value to be shifted
   * @param  {Number | Boolean | String | null} y Amount of shifts
   * @return {Integer | BigNumber | Unit | Array | Matrix} `x` zero-filled shifted right `y` times
   */
  math.rightLogShift = function rightLogShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('rightLogShift', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (isNaN(x)) {
        throw new Error('Parameter x contains a NaN value');
      }
      if (isNaN(y)) {
        throw new Error('Parameter y contains a NaN value');
      }
      return x >>> y;
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
        if (x.value == null) {
          throw new Error('Parameter x contains a unit with undefined value');
        }

        var res = x.clone();
        if (isNumber(res.value)) {
          var baseChange = res.prefix['value'];
          res.value = ((res.value / baseChange) >>> y) * baseChange;
          res.fixPrefix = false;
          return res;
        }
      }
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, rightLogShift);
    }

    if (isString(x)) {
      return rightLogShift(parseInt(x), y);
    }
    if (isString(y)) {
      return rightLogShift(x, parseInt(y));
    }

    if (isBoolean(x) || x === null) {
      return rightLogShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return rightLogShift(x, +y);
    }

    throw new math.error.UnsupportedTypeError('rightLogShift', math['typeof'](x), math['typeof'](y));
  };
};
