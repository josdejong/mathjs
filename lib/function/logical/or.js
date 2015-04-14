'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Logical `or`. Test if at least one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.or(x, y)
   *
   * Examples:
   *
   *    math.or(2, 4);   // returns true
   *
   *    a = [2, 5, 0];
   *    b = [0, 22, 0];
   *    c = 0;
   *
   *    math.or(a, b);   // returns [true, true, false]
   *    math.or(b, c);   // returns [false, true, false]
   *
   * See also:
   *
   *    and, not, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one of the inputs is defined with a nonzero/nonempty value.
   */
  var or = typed('or', {
    'number, number': function (x, y) {
      return !!(x || y);
    },

    'Complex, Complex': function (x, y) {
      return (x.re !== 0 || x.im !== 0) || (y.re !== 0 || y.im !== 0);
    },

    'BigNumber, BigNumber': function (x, y) {
      return (!x.isZero() && !x.isNaN()) || (!y.isZero() && !y.isNaN());
    },

    'Unit, Unit': function (x, y) {
      return (x.value !== 0 && x.value !== null) || (y.value !== 0 && y.value !== null);
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, or);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, or);
    }
  });

  return or;
}

exports.name = 'or';
exports.factory = factory;
