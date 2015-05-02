'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitXor = require('../../util/bignumber').xor;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitXor(x, y)
   *
   * Examples:
   *
   *    math.bitXor(1, 2);               // returns Number 3
   *
   *    math.bitXor([2, 3, 4], 4);       // returns Array [6, 7, 0]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to xor
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to xor
   * @return {Number | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  var bitXor = typed('bitXor', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitXor');
      }

      return x ^ y;
    },

    'BigNumber, BigNumber': bigBitXor,

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = elementWiseOperations.algorithm7(x, y, bitXor);
              break;
            default:
              // sparse + dense
              c = elementWiseOperations.algorithm3(y, x, bitXor, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = elementWiseOperations.algorithm3(x, y, bitXor, false);
              break;
            default:
              // dense + dense
              c = elementWiseOperations.algorithm12(x, y, bitXor);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return bitXor(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return bitXor(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return bitXor(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm11(x, y, bitXor, false);
          break;
        default:
          c = elementWiseOperations.algorithm13(x, y, bitXor, false);
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
          c = elementWiseOperations.algorithm11(y, x, bitXor, true);
          break;
        default:
          c = elementWiseOperations.algorithm13(y, x, bitXor, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm13(matrix(x), y, bitXor, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm13(matrix(y), x, bitXor, true).valueOf();
    }
  });

  return bitXor;
}

exports.name = 'bitXor';
exports.factory = factory;
