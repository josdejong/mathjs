'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitAnd = require('../../util/bignumber').and;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));

  var algorithm02 = load(require('../../type/matrix/util/algorithm02'));
  var algorithm06 = load(require('../../type/matrix/util/algorithm06'));
  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  
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
              c = algorithm06(x, y, bitAnd, false);
              break;
            default:
              // sparse & dense
              c = algorithm02(y, x, bitAnd, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense & sparse
              c = algorithm02(x, y, bitAnd, false);
              break;
            default:
              // dense & dense
              c = algorithm12(x, y, bitAnd);
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
          c = algorithm10(x, y, bitAnd, false);
          break;
        default:
          c = algorithm13(x, y, bitAnd, false);
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
          c = algorithm10(y, x, bitAnd, true);
          break;
        default:
          c = algorithm13(y, x, bitAnd, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, bitAnd, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, bitAnd, true).valueOf();
    }
  });

  return bitAnd;
}

exports.name = 'bitAnd';
exports.factory = factory;
