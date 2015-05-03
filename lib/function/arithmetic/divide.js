'use strict';

function factory (type, config, load, typed) {

  var divideScalar = load(require('./divideScalar'));
  var multiply     = load(require('./multiply'));
  var inv          = load(require('../matrix/inv'));
  var matrix       = load(require('../construction/matrix'));

  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  
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

    'Matrix, any': function (x, y) {
      // result
      var c;

      // process storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm10(x, y, divideScalar, false);
          break;
        case 'dense':
          c = algorithm13(x, y, divideScalar, false);
          break;
      }
      return c;
    },
    
    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, divideScalar, false).valueOf();
    },

    'any, Array | Matrix': function (x, y) {
      return multiply(x, inv(y));
    }
  });
}

exports.name = 'divide';
exports.factory = factory;
