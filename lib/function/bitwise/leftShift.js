'use strict';

var isInteger = require('../../util/number').isInteger;
var bigLeftShift = require('../../util/bignumber').leftShift;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var equalScalar = load(require('../relational/equalScalar'));
  var zeros = load(require('../matrix/zeros'));

  var algorithm01 = load(require('../../type/matrix/util/algorithm01'));
  var algorithm02 = load(require('../../type/matrix/util/algorithm02'));
  var algorithm08 = load(require('../../type/matrix/util/algorithm08'));
  var algorithm10 = load(require('../../type/matrix/util/algorithm10'));
  var algorithm11 = load(require('../../type/matrix/util/algorithm11'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/util/algorithm14'));

  /**
   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2);               // returns Number 4
   *
   *    math.leftShift([1, 2, 3], 4);       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    leftShift, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
   * @return {Number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  var leftShift = typed('leftShift', {
    
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function leftShift');
      }

      return x << y;
    },

    'BigNumber, BigNumber': bigLeftShift,

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse & sparse
              c = algorithm08(x, y, leftShift, false);
              break;
            default:
              // sparse & dense
              c = algorithm02(y, x, leftShift, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense & sparse
              c = algorithm01(x, y, leftShift, false);
              break;
            default:
              // dense & dense
              c = algorithm13(x, y, leftShift);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return leftShift(x, matrix(y));
    },

    'Matrix, number | BigNumber': function (x, y) {
      // check scalar
      if (!equalScalar(y, 0)) {
        // result
        var c;
        // check storage format
        switch (x.storage()) {
          case 'sparse':
            c = algorithm11(x, y, leftShift, false);
            break;
          default:
            c = algorithm14(x, y, leftShift, false);
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
            c = algorithm10(y, x, leftShift, true);
            break;
          default:
            c = algorithm14(y, x, leftShift, true);
            break;
        }
        return c;
      }
      return zeros(y.size(), y.storage());
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return leftShift(matrix(x), y).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return leftShift(x, matrix(y)).valueOf();
    }
  });

  return leftShift;
}

exports.name = 'leftShift';
exports.factory = factory;
