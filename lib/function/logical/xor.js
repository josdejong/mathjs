'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));

  var algorithm03 = load(require('../../type/matrix/util/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/util/algorithm07'));
  var algorithm11 = load(require('../../type/matrix/util/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  
  /**
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(2, 4);   // returns false
   *
   *    a = [2, 0, 0];
   *    b = [2, 7, 0];
   *    c = 0;
   *
   *    math.xor(a, b);   // returns [false, true, false]
   *    math.xor(a, c);   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  var xor = typed('xor', {
 
    'number, number': function (x, y) {
      return !!(!!x ^ !!y);
    },

    'Complex, Complex': function (x, y) {
      return !!((x.re !== 0 || x.im !== 0) ^ (y.re !== 0 || y.im !== 0));
    },

    'BigNumber, BigNumber': function (x, y) {
      return !!((!x.isZero() && !x.isNaN()) ^ (!y.isZero() && !y.isNaN()));
    },

    'Unit, Unit': function (x, y) {
      return !!((x.value !== 0 && x.value !== null) ^ (y.value !== 0 && y.value !== null));
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
              c = algorithm07(x, y, xor);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, xor, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, xor, false);
              break;
            default:
              // dense + dense
              c = algorithm12(x, y, xor);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return xor(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return xor(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return xor(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, xor, false);
          break;
        default:
          c = algorithm13(x, y, xor, false);
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
          c = algorithm11(y, x, xor, true);
          break;
        default:
          c = algorithm13(y, x, xor, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, xor, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, xor, true).valueOf();
    }
  });

  return xor;
}

exports.name = 'xor';
exports.factory = factory;
