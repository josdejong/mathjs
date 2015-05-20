'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitNot = require('../../util/bignumber').not;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
   *    math.bitNot(1);               // returns number -2
   *
   *    math.bitNot([2, -3, 4]);      // returns Array [-3, 2, 5]
   *
   * See also:
   *
   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x Value to not
   * @return {number | BigNumber | Array | Matrix} NOT of `x`
   */
  var bitNot = typed('bitNot', {
    'number': function (x) {
      if (!isInteger(x)) {
        throw new Error('Integer expected in function bitNot');
      }

      return ~x;
    },

    'BigNumber': bigBitNot,

    'Array | Matrix': function (x) {
      return collection.deepMap(x, bitNot);
    }
  });

  return bitNot;
}

exports.name = 'bitNot';
exports.factory = factory;
