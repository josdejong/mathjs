'use strict';

module.exports = function(config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var divideScalar = require('./divideScalar');
  var multiply = require('./multiply');
  var inv = require('../matrix/inv')(config);

  /**
   * Divide two values, `x / y`.
   * To divide matrices, `x` is multiplied with the inverse of `y`: `x * inv(y)`.
   *
   * Syntax:
   *
   *    math.divide(x, y)
   *
   * Examples:
   *
   *    math.divide(2, 3);            // returns Number 0.6666666666666666
   *
   *    var a = math.complex(5, 14);
   *    var b = math.complex(4, 1);
   *    math.divide(a, b);            // returns Complex 2 + 3i
   *
   *    var c = [[7, -6], [13, -4]];
   *    var d = [[1, 2], [4, 3]];
   *    math.divide(c, d);            // returns Array [[-9, 4], [-11, 6]]
   *
   *    var e = math.unit('18 km');
   *    math.divide(e, 4.5);          // returns Unit 4 km
   *
   * See also:
   *
   *    multiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x   Numerator
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} y          Denominator
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
   */

  return typed('divide', {
    'any, any': divideScalar,

    'Array | Matrix, Array | Matrix': function (x, y) {
      // TODO: implement matrix right division using pseudo inverse
      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y));
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, divideScalar);
    },

    'any, Array | Matrix': function (x, y) {
      return multiply(x, inv(y));
    }
  });
};

// TODO: cleanup
//math.divide = function(x, y) {
//  if (arguments.length != 2) {
//    throw new TypeError('Too ' + (arguments.length > 2 ? 'many' : 'few') +
//    ' arguments (expected: 2, actual: ' + arguments.length + ')');
//  }
//
//  if (isCollection(x)) {
//    if (isCollection(y)) {
//      // TODO: implement matrix right division using pseudo inverse
//      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
//      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
//      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
//      return math.multiply(x, math.inv(y));
//    }
//    else {
//      // matrix / scalar
//      return collection.deepMap2(x, y, divideScalar);
//    }
//  }
//
//  if (isCollection(y)) {
//    // TODO: implement matrix right division using pseudo inverse
//    return math.multiply(x, math.inv(y));
//  }
//
//  // divide two scalars
//  return divideScalar(x, y);
//};
