'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(2, 4);   // returns false
   *
   *    a = [2, 0, 0];
   *    b = [2, 7, 0];
   *    c = 0;
   *
   *    math.xor(a, b);   // returns [false, true, false]
   *    math.xor(a, c);   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  var xor = typed('xor', {
    'number, number': function (x, y) {
      return !!(!!x ^ !!y);
    },

    'Complex, Complex': function (x, y) {
      return !!((x.re !== 0 || x.im !== 0) ^ (y.re !== 0 || y.im !== 0));
    },

    'BigNumber, BigNumber': function (x, y) {
      return !!((!x.isZero() && !x.isNaN()) ^ (!y.isZero() && !y.isNaN()));
    },

    'Unit, Unit': function (x, y) {
      return !!((x.value !== 0 && x.value !== null) ^ (y.value !== 0 && y.value !== null));
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, xor);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, xor);
    }
  });

  return xor;
}

exports.name = 'xor';
exports.factory = factory;
