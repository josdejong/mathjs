'use strict';

function factory (type, config, load, typed) {

  var collection = load(require('../../type/matrix/collection'));
  var complexMultiply = typed.find(load(require('./multiplyScalar')), ['Complex,Complex']);

  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2);            // returns number 8
   *    math.pow(2, 3);          // returns number 8
   *    math.cube(4);            // returns number 64
   *    4 * 4 * 4;               // returns number 64
   *
   *    math.cube([1, 2, 3, 4]); // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix} x  Number for which to calculate the cube
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix} Cube of x
   */
  var cube = typed('cube', {
    'number': function (x) {
      return x * x * x;
    },

    'Complex': function (x) {
      return complexMultiply(complexMultiply(x, x), x);
    },

    'BigNumber': function (x) {
      return x.times(x).times(x);
    },

    'Fraction': function (x) {
      return x.mul(x).mul(x);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cube(0) = 0
      return collection.deepMap(x, cube, true);
    }
  });

  cube.toTex = '\\left(${args[0]}\\right)^3';

  return cube;
}

exports.name = 'cube';
exports.factory = factory;
