'use strict';

var collection = require('../../type/collection');
var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {
  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3);         // returns false
   *    math.equal(2 + 2, 4);         // returns true
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.equal(a, b);             // returns true
   *
   *    var c = [2, 5, 1];
   *    var d = [2, 7, 1];
   *
   *    math.equal(c, d);             // returns [true, false, true]
   *    math.deepEqual(c, d);         // returns false
   *
   *    math.equal(0, null);          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  var equal = typed('equal', {
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y === null; }
      if (y === null) { return x === null; }
      if (x === undefined) { return y === undefined; }
      if (y === undefined) { return x === undefined; }

      return _equal(x, y);
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, _equal);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, _equal);
    }
  });

  var _equal = typed('_equal', {
    'boolean, boolean': function (x, y) {
      return x === y;
    },

    'number, number': function (x, y) {
      return x === y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.eq(y);
    },

    'Complex, Complex': function (x, y) {
      return (x.re === y.re || nearlyEqual(x.re, y.re, config.epsilon)) &&
             (x.im === y.im || nearlyEqual(x.im, y.im, config.epsilon));
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value === y.value || nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x === y;
    }
  });

  return equal;
}

exports.type = 'function';
exports.name = 'equal';
exports.factory = factory;
