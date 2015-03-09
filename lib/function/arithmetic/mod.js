'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See http://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3);                // returns 2
   *    math.mod(11, 2);               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0;
   *    }
   *
   *    isOdd(2);                      // returns false
   *    isOdd(3);                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Dividend
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Divisor
   * @return {Number | BigNumber | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */
  var mod = typed('mod', {
    'number, number': _mod,

    'BigNumber, BigNumber': function (x, y) {
      return y.isZero() ? x : x.mod(y);
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, mod);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, mod);
    }
  });

  return mod;

  /**
   * Calculate the modulus of two numbers
   * @param {Number} x
   * @param {Number} y
   * @returns {number} res
   * @private
   */
  function _mod(x, y) {
    if (y > 0) {
      // We don't use JavaScript's % operator here as this doesn't work
      // correctly for x < 0 and x == 0
      // see http://en.wikipedia.org/wiki/Modulo_operation
      return x - y * Math.floor(x / y);
    }
    else if (y === 0) {
      return x;
    }
    else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor');
    }
  }
};
