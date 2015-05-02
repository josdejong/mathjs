'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var multiplyScalar = load(require('./multiplyScalar'));

  var algorithm02 = load(require('../../type/matrix/util/algorithm02'));
  var algorithm06 = load(require('../../type/matrix/util/algorithm06'));
  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));

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
              c = algorithm06(x, y, multiplyScalar, false);
              break;
            default:
              // sparse .* dense
              c = algorithm02(y, x, multiplyScalar, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense .* sparse
              c = algorithm02(x, y, multiplyScalar, false);
              break;
            default:
              // dense .* dense
              c = algorithm12(x, y, multiplyScalar);
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
          c = algorithm10(x, y, multiplyScalar, false);
          break;
        default:
          c = algorithm13(x, y, multiplyScalar, false);
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
          c = algorithm10(y, x, multiplyScalar, true);
          break;
        default:
          c = algorithm13(y, x, multiplyScalar, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, multiplyScalar, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, multiplyScalar, true).valueOf();
    }
  });
  
  return dotMultiply;
}

exports.name = 'dotMultiply';
exports.factory = factory;
