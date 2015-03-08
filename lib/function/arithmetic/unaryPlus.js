'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var BigNumber = require('../../type/BigNumber'); // FIXME: must use BigNumber from the math namespace
  var collection = require('../../type/collection');

  /**
   * Unary plus operation.
   * Boolean values and strings will be converted to a number, numeric values will be returned as is.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.unaryPlus(x)
   *
   * Examples:
   *
   *    math.unaryPlus(3.5);      // returns 3.5
   *    math.unaryPlus(1);     // returns 1
   *
   * See also:
   *
   *    unaryMinus, add, subtract
   *
   * @param  {Number | BigNumber | Boolean | String | Complex | Unit | Array | Matrix | null} x
   *            Input value
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns the input value when numeric, converts to a number when input is non-numeric.
   */
  var unaryPlus = typed('unaryPlus', {
    'number': function (x) {
      return x;
    },

    'Complex': function (x) {
      return x.clone();
    },

    'BigNumber': function (x) {
      return x;
    },

    'Unit': function (x) {
      return x.clone();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, unaryPlus);
    },

    'boolean | string | null': function (x) {
      // convert to a number or bignumber
      return (config.number == 'bignumber') ? new BigNumber(+x): +x;
    }
  });

  return unaryPlus;
};
