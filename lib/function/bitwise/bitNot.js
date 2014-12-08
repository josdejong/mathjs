'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isCollection = collection.isCollection;

  /**
   * Bitwise NOT value, `~x`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.bitNot(x)
   *
   * Examples:
   *
   *    math.bitNot(1);               // returns Number -2
   *
   *    math.bitNot([2, -3, 4]);      // returns Array [-3, 2, 5]
   *
   * See also:
   *
   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | String | Array | Matrix | null} x Value to not 
   * @return {Integer | BigNumber | Array | Matrix} NOT of `x`
   */
  math.bitNot = function bitNot(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('bitNot', arguments.length, 1);
    }

    if (isNumber(x)) {
      return ~x;
    }

    if (x instanceof BigNumber) {
      return x.not();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, bitNot);
    }

    if (isString(x)) {
      return bitNot((config.number == 'bignumber')
                    ? new BigNumber(x)
                    : +x);
    }

    if (isBoolean(x) || x === null) {
      return bitNot(+x);
    }

    throw new math.error.UnsupportedTypeError('bitNot', math['typeof'](x));
  };
};
