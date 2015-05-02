'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var equal = load(require('../relational/equal'));
  var zeros = load(require('../matrix/zeros'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2);               // returns Number 1
   *
   *    math.rightLogShift([16, -32, 64], 4);   // returns Array [1, 2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
   *
   * @param  {Number | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | Boolean | null} y Amount of shifts
   * @return {Number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  var rightLogShift = typed('rightLogShift', {

    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function rightLogShift');
      }

      return x >>> y;
    },

    // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse & sparse
              c = elementWiseOperations.algorithm8(x, y, rightLogShift, false);
              break;
            default:
              // sparse & dense
              c = elementWiseOperations.algorithm2(y, x, rightLogShift, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense & sparse
              c = elementWiseOperations.algorithm1(x, y, rightLogShift, false);
              break;
            default:
              // dense & dense
              c = elementWiseOperations.algorithm12(x, y, rightLogShift);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(x, matrix(y));
    },

    'Matrix, number | BigNumber': function (x, y) {
      // check scalar
      if (!equal(y, 0)) {
        // result
        var c;
        // check storage format
        switch (x.storage()) {
          case 'sparse':
            c = elementWiseOperations.algorithm10(x, y, rightLogShift, false);
            break;
          default:
            c = elementWiseOperations.algorithm13(x, y, rightLogShift, false);
            break;
        }
        return c;
      }
      return x.clone();
    },

    'number | BigNumber, Matrix': function (x, y) {
      // check scalar
      if (!equal(x, 0)) {
        // result
        var c;
        // check storage format
        switch (y.storage()) {
          case 'sparse':
            c = elementWiseOperations.algorithm9(y, x, rightLogShift, true);
            break;
          default:
            c = elementWiseOperations.algorithm13(y, x, rightLogShift, true);
            break;
        }
        return c;
      }
      return zeros(y.size(), y.storage());
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return rightLogShift(matrix(x), y).valueOf();
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return rightLogShift(x, matrix(y)).valueOf();
    }
  });

  return rightLogShift;
}

exports.name = 'rightLogShift';
exports.factory = factory;
