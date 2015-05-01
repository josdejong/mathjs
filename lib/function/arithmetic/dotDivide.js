'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var divideScalar = load(require('./divideScalar'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotDivide(x, y)
   *
   * Examples:
   *
   *    math.dotDivide(2, 4);   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotDivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b);      // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, dotMultiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Numerator
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Denominator
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
   */
  var dotDivide = typed('dotDivide', {
    
    'any, any': divideScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse ./ sparse
              c = elementWiseOperations.algorithm7(x, y, divideScalar, false);
              break;
            default:
              // sparse ./ dense
              c = elementWiseOperations.algorithm2(y, x, divideScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense ./ sparse
              c = elementWiseOperations.algorithm3(x, y, divideScalar, false);
              break;
            default:
              // dense ./ dense
              c = elementWiseOperations.algorithm11(x, y, divideScalar);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotDivide(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotDivide(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm9(x, y, divideScalar, false);
          break;
        default:
          c = elementWiseOperations.algorithm12(x, y, divideScalar, false);
          break;
      }
      return c;
    },

    'any, Matrix': function (x, y) {
      // result
      var c;
      // check storage format
      switch (y.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm10(y, x, divideScalar, true);
          break;
        default:
          c = elementWiseOperations.algorithm12(y, x, divideScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(x), y, divideScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(y), x, divideScalar, true).valueOf();
    }
  });
  
  return dotDivide;
}

exports.name = 'dotDivide';
exports.factory = factory;
