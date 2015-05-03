'use strict';

var isInteger = require('../../util/number').isInteger;
var bigRightArithShift = require('../../util/bignumber').rightArithShift;

function factory (type, config, load, typed) {
  
  var matrix = load(require('../construction/matrix'));
  var equalScalar = load(require('../relational/equalScalar'));
  var zeros = load(require('../matrix/zeros'));

  var algorithm01 = load(require('../../type/matrix/util/algorithm01'));
  var algorithm02 = load(require('../../type/matrix/util/algorithm02'));
  var algorithm08 = load(require('../../type/matrix/util/algorithm08'));
  var algorithm09 = load(require('../../type/matrix/util/algorithm09'));
  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));

  /**
   * Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightArithShift(x, y)
   *
   * Examples:
   *
   *    math.rightArithShift(4, 2);               // returns Number 1
   *
   *    math.rightArithShift([16, -32, 64], 4);   // returns Array [1, -2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
   * @return {Number | BigNumber | Array | Matrix} `x` sign-filled shifted right `y` times
   */
  var rightArithShift = typed('rightArithShift', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function rightArithShift');
      }

      return x >> y;
    },

    'BigNumber, BigNumber': bigRightArithShift,

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse & sparse
              c = algorithm08(x, y, rightArithShift, false);
              break;
            default:
              // sparse & dense
              c = algorithm02(y, x, rightArithShift, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense & sparse
              c = algorithm01(x, y, rightArithShift, false);
              break;
            default:
              // dense & dense
              c = algorithm12(x, y, rightArithShift);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return rightArithShift(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return rightArithShift(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return rightArithShift(x, matrix(y));
    },

    'Matrix, number | BigNumber': function (x, y) {
      // check scalar
      if (!equalScalar(y, 0)) {
        // result
        var c;
        // check storage format
        switch (x.storage()) {
          case 'sparse':
            c = algorithm10(x, y, rightArithShift, false);
            break;
          default:
            c = algorithm13(x, y, rightArithShift, false);
            break;
        }
        return c;
      }
      return x.clone();
    },

    'number | BigNumber, Matrix': function (x, y) {
      // check scalar
      if (!equalScalar(x, 0)) {
        // result
        var c;
        // check storage format
        switch (y.storage()) {
          case 'sparse':
            c = algorithm09(y, x, rightArithShift, true);
            break;
          default:
            c = algorithm13(y, x, rightArithShift, true);
            break;
        }
        return c;
      }
      return zeros(y.size(), y.storage());
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return rightArithShift(matrix(x), y).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return rightArithShift(x, matrix(y)).valueOf();
    }
  });

  return rightArithShift;
}

exports.name = 'rightArithShift';
exports.factory = factory;
