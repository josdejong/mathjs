'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var multiplyScalar = load(require('./multiplyScalar'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotMultiply(x, y)
   *
   * Examples:
   *
   *    math.dotMultiply(2, 4); // returns 8
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.dotMultiply(a, b); // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b);    // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, dotDivide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Left hand value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Right hand value
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
   */
  var dotMultiply = typed('dotMultiply', {
    
    'any, any': multiplyScalar,
    
    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse .* sparse
              c = elementWiseOperations.algorithm6(x, y, multiplyScalar, false);
              break;
            default:
              // sparse .* dense
              c = elementWiseOperations.algorithm2(y, x, multiplyScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense .* sparse
              c = elementWiseOperations.algorithm2(x, y, multiplyScalar, false);
              break;
            default:
              // dense .* dense
              c = elementWiseOperations.algorithm11(x, y, multiplyScalar, false);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), matrix(y)).valueOf();
    },
    
    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return dotMultiply(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return dotMultiply(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm9(x, y, multiplyScalar, false);
          break;
        default:
          c = elementWiseOperations.algorithm12(x, y, multiplyScalar, false);
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
          c = elementWiseOperations.algorithm9(y, x, multiplyScalar, true);
          break;
        default:
          c = elementWiseOperations.algorithm12(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(y), x, multiplyScalar, true).valueOf();
    }
  });
  
  return dotMultiply;
}

exports.name = 'dotMultiply';
exports.factory = factory;
