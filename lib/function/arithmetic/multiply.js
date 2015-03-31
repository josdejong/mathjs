'use strict';

var size = require('../../util/array').size;

function factory (type, config, load, typed) {
  var matrix = load(require('../construction/matrix'));
  var add = load(require('./add'));

  /**
   * Multiply two values, `x * y`. The result is squeezed.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns Number 20.8
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to multiply
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to multiply
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  var multiply = typed('multiply', {
    'number, number': function (x, y) {
      return x * y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
          x.re * y.re - x.im * y.im,
          x.re * y.im + x.im * y.re
      );
    },

    'number, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
      return res;
    },

    'Unit, number': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
      return res;
    },

    'Array, Array': function (x, y) {
      var m = matrix(x).multiply(y);
      return m instanceof type.Matrix ? m.toArray() : m;
    },

    'Matrix, Matrix': function (x, y) {
      return x.multiply(y);
    },

    'Matrix, Array': function (x, y) {
      return x.multiply(y);
    },

    'Array, Matrix': function (x, y) {
      return matrix(x, y.storage()).multiply(y);
    },

    'Array, any': function (x, y) {
      return matrix(x).multiply(y).valueOf();
    },

    'Matrix, any': function (x, y) {
      return x.multiply(y);
    },

    'any, Array': function (x, y) { 
      // scalar * Array
      return matrix(y).multiply(x).toArray();
    },
    
    'any, Array | Matrix': function (x, y) { 
      // scalar * Matrix 
      return y.multiply(x);
    }
  });

  return multiply;
}

exports.name = 'multiply';
exports.factory = factory;
