'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      Matrix = math.type.Matrix,
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
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
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightArithShift
   *
   * @param  {Number | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | Boolean | null} y Amount of shifts
   * @return {Number | Array | Matrix} `x` zero-filled shifted right `y` times
   */
  math.rightLogShift = function rightLogShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('rightLogShift', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Parameters in function rightLogShift must be integer numbers');
      }

      return x >>> y;
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, rightLogShift);
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
