'use strict';

var number = require('../../util/number');

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Compute the sign of a value. The sign of a value x is:
   *
   * -  1 when x > 1
   * - -1 when x < 0
   * -  0 when x == 0
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sign(x)
   *
   * Examples:
   *
   *    math.sign(3.5);               // returns 1
   *    math.sign(-4.2);              // returns -1
   *    math.sign(0);                 // returns 0
   *
   *    math.sign([3, 5, -2, 0, 2]);  // returns [1, 1, -1, 0, 1]
   *
   * See also:
   *
   *    abs
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            The number for which to determine the sign
   * @return {Number | BigNumber | Complex | Array | Matrix}e
   *            The sign of `x`
   */
  var sign = typed('sign', {
    'number': number.sign,

    'Complex': function (x) {
      var abs = Math.sqrt(x.re * x.re + x.im * x.im);
      return new x.constructor(x.re / abs, x.im / abs);
    },

    'BigNumber': function (x) {
      return new x.constructor(x.cmp(0));
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sign(0) = 0
      return collection.deepMap(x, sign, true);
    }
  });

  return sign;
}

exports.name = 'sign';
exports.factory = factory;

