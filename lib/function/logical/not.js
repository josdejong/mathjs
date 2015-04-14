'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Logical `not`. Flips boolean value of a given parameter.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.not(x)
   *
   * Examples:
   *
   *    math.not(2);      // returns false
   *    math.not(0);      // returns true
   *    math.not(true);   // returns false
   *
   *    a = [2, -7, 0];
   *    math.not(a);      // returns [false, false, true]
   *
   * See also:
   *
   *    and, or, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when input is a zero or empty value.
   */
  var not = typed('not', {
    'number': function (x) {
      return !x;
    },

    'Complex': function (x) {
      return x.re === 0 && x.im === 0;
    },

    'BigNumber': function (x) {
      return x.isZero() || x.isNaN();
    },

    'Unit': function (x) {
      return x.value === null || x.value == 0;
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, not);
    }
  });

  return not;
}

exports.name = 'not';
exports.factory = factory;
