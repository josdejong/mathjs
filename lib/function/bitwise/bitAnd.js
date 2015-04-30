'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitAnd = require('../../util/bignumber').and;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitAnd(x, y)
   *
   * Examples:
   *
   *    math.bitAnd(53, 131);               // returns Number 1
   *
   *    math.bitAnd([1, 12, 31], 42);       // returns Array [0, 8, 10]
   *
   * See also:
   *
   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to and
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to and
   * @return {Number | BigNumber | Array | Matrix} AND of `x` and `y`
   */
  var bitAnd = typed('bitAnd', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitAnd');
      }

      return x & y;
    },

    'BigNumber, BigNumber': bigBitAnd,

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse & sparse
              c = elementWiseOperations.algorithm6(x, y, bitAnd, false);
              break;
            default:
              // sparse & dense
              c = elementWiseOperations.algorithm2(y, x, bitAnd, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense & sparse
              c = elementWiseOperations.algorithm2(x, y, bitAnd, false);
              break;
            default:
              // dense & dense
              c = elementWiseOperations.algorithm11(x, y, bitAnd, false);
              break;
          }
          break;
      }
      return c;
    },
    
    'Array, Array': function (x, y) {
      // use matrix implementation
      return bitAnd(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return bitAnd(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return bitAnd(x, matrix(y));
    },
    
    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm9(x, y, bitAnd, false);
          break;
        default:
          c = elementWiseOperations.algorithm12(x, y, bitAnd, false);
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
          c = elementWiseOperations.algorithm9(y, x, bitAnd, true);
          break;
        default:
          c = elementWiseOperations.algorithm12(y, x, bitAnd, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(x), y, bitAnd, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm12(matrix(y), x, bitAnd, true).valueOf();
    }
  });

  return bitAnd;
}

exports.name = 'bitAnd';
exports.factory = factory;
