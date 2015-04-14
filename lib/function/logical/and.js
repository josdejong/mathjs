'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(2, 4);   // returns true
   *
   *    a = [2, 0, 0];
   *    b = [3, 7, 0];
   *    c = 0;
   *
   *    math.and(a, b);   // returns [true, false, false]
   *    math.and(a, c);   // returns [false, false, false]
   *
   * See also:
   *
   *    not, or, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when both inputs are defined with a nonzero/nonempty value.
   */
  var and = typed('and', {
    'number, number': function (x, y) {
      return !!(x && y);
    },

    'Complex, Complex': function (x, y) {
      return (x.re !== 0 || x.im !== 0) && (y.re !== 0 || y.im !== 0);
    },

    'BigNumber, BigNumber': function (x, y) {
      return !x.isZero() && !y.isZero() && !x.isNaN() && !y.isNaN();
    },

    'Unit, Unit': function (x, y) {
      return (x.value !== 0 && x.value !== null) && (y.value !== 0 && y.value !== null);
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, and);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, and);
    }
  });

  return and;
}

exports.name = 'and';
exports.factory = factory;
