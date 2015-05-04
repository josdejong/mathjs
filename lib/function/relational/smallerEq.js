'use strict';

var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));

  var algorithm03 = load(require('../../type/matrix/util/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/util/algorithm07'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/util/algorithm14'));

  /**
   * Test whether value x is smaller or equal to y.
   *
   * The function returns true when x is smaller than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.smallerEq(x, y)
   *
   * Examples:
   *
   *    math.smaller(1 + 2, 3);        // returns false
   *    math.smallerEq(1 + 2, 3);      // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, larger, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  var smallerEq = typed('smallerEq', {

    'boolean, boolean': function (x, y) {
      return x <= y;
    },

    'number, number': function (x, y) {
      return x <= y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lte(y);
    },

    'Complex, Complex': function () {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value <= y.value || nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x <= y;
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
              c = algorithm07(x, y, smallerEq);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, smallerEq, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, smallerEq, false);
              break;
            default:
              // dense + dense
              c = algorithm13(x, y, smallerEq);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return smallerEq(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return smallerEq(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return smallerEq(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm12(x, y, smallerEq, false);
          break;
        default:
          c = algorithm14(x, y, smallerEq, false);
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
          c = algorithm12(y, x, smallerEq, true);
          break;
        default:
          c = algorithm14(y, x, smallerEq, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, smallerEq, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, smallerEq, true).valueOf();
    }
  });

  return smallerEq;
}

exports.name = 'smallerEq';
exports.factory = factory;
