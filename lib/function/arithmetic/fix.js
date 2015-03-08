'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *
   * Examples:
   *
   *    math.fix(3.2);                // returns Number 3
   *    math.fix(3.8);                // returns Number 3
   *    math.fix(-4.2);               // returns Number -4
   *    math.fix(-4.7);               // returns Number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.fix(c);                  // returns Complex 3 - 2i
   *
   *    math.fix([3.2, 3.8, -4.7]);   // returns Array [3, 3, -4]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x Number to be rounded
   * @return {Number | BigNumber | Complex | Array | Matrix}            Rounded value
   */
  var fix = typed('fix', {
    'number': function (x) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    },

    'Complex': function (x) {
      return new x.constructor(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.isNegative() ? x.ceil() : x.floor();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, fix);
    }
  });

  return fix;
};
