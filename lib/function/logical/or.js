'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));
  var elementWiseOperations = load(require('../../type/matrix/util/elementWiseOperations'));

  /**
   * Logical `or`. Test if at least one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.or(x, y)
   *
   * Examples:
   *
   *    math.or(2, 4);   // returns true
   *
   *    a = [2, 5, 0];
   *    b = [0, 22, 0];
   *    c = 0;
   *
   *    math.or(a, b);   // returns [true, true, false]
   *    math.or(b, c);   // returns [false, true, false]
   *
   * See also:
   *
   *    and, not, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one of the inputs is defined with a nonzero/nonempty value.
   */
  var or = typed('or', {

    'number, number': function (x, y) {
      return !!(x || y);
    },

    'Complex, Complex': function (x, y) {
      return (x.re !== 0 || x.im !== 0) || (y.re !== 0 || y.im !== 0);
    },

    'BigNumber, BigNumber': function (x, y) {
      return (!x.isZero() && !x.isNaN()) || (!y.isZero() && !y.isNaN());
    },

    'Unit, Unit': function (x, y) {
      return (x.value !== 0 && x.value !== null) || (y.value !== 0 && y.value !== null);
    },

    'Matrix, Matrix': function (x, y) {
      // result
      var c;

      // process matrix storage
      switch (x.storage()) {
        case 'sparse':
          switch (y.storage()) {
            case 'sparse':
              // sparse + sparse
              c = elementWiseOperations.algorithm5(x, y, or);
              break;
            default:
              // sparse + dense
              c = elementWiseOperations.algorithm3(y, x, or, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = elementWiseOperations.algorithm3(x, y, or, false);
              break;
            default:
              // dense + dense
              c = elementWiseOperations.algorithm12(x, y, or);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return or(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return or(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return or(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = elementWiseOperations.algorithm11(x, y, or, false);
          break;
        default:
          c = elementWiseOperations.algorithm13(x, y, or, false);
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
          c = elementWiseOperations.algorithm11(y, x, or, true);
          break;
        default:
          c = elementWiseOperations.algorithm13(y, x, or, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm13(matrix(x), y, or, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return elementWiseOperations.algorithm13(matrix(y), x, or, true).valueOf();
    }
  });

  return or;
}

exports.name = 'or';
exports.factory = factory;
