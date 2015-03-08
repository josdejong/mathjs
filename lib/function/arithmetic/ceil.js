'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Round a value towards plus infinity
   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.ceil(x)
   *
   * Examples:
   *
   *    math.ceil(3.2);               // returns Number 4
   *    math.ceil(3.8);               // returns Number 4
   *    math.ceil(-4.2);              // returns Number -4
   *    math.ceil(-4.7);              // returns Number -4
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.ceil(c);                 // returns Complex 4 - 2i
   *
   *    math.ceil([3.2, 3.8, -4.7]);  // returns Array [4, 4, -4]
   *
   * See also:
   *
   *    floor, fix, round
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number to be rounded
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  var ceil = typed('ceil', {
    'number': Math.ceil,

    'Complex': function (x) {
      return new x.constructor(
          Math.ceil(x.re),
          Math.ceil(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.ceil();
    },

    'Array | Matrix': function (coll) {
      return collection.deepMap(coll, ceil);
    }
  });

  return ceil;
};
