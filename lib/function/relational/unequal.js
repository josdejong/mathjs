'use strict';

var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {

  var matrix = load(require('../construction/matrix'));

  var algorithm03 = load(require('../../type/matrix/util/algorithm03'));
  var algorithm07 = load(require('../../type/matrix/util/algorithm07'));
  var algorithm11 = load(require('../../type/matrix/util/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm13 = load(require('../../type/matrix/util/algorithm13'));

  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everying
   * except. `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3);       // returns true
   *    math.unequal(2 + 2, 4);       // returns false
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.unequal(a, b);           // returns false
   *
   *    var c = [2, 5, 1];
   *    var d = [2, 7, 1];
   *
   *    math.unequal(c, d);           // returns [false, true, false]
   *    math.deepEqual(c, d);         // returns false
   *
   *    math.unequal(0, null);        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */
  var unequal = typed('unequal', {
    
    'any, any': function (x, y) {
      // strict equality for null and undefined?
      if (x === null) { return y !== null; }
      if (y === null) { return x !== null; }
      if (x === undefined) { return y !== undefined; }
      if (y === undefined) { return x !== undefined; }

      return _unequal(x, y);
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
              c = algorithm07(x, y, _unequal);
              break;
            default:
              // sparse + dense
              c = algorithm03(y, x, _unequal, true);
              break;
          }
          break;
        default:
          switch (y.storage()) {
            case 'sparse':
              // dense + sparse
              c = algorithm03(x, y, _unequal, false);
              break;
            default:
              // dense + dense
              c = algorithm12(x, y, _unequal);
              break;
          }
          break;
      }
      return c;
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return unequal(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return unequal(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return unequal(x, matrix(y));
    },

    'Matrix, any': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, _unequal, false);
          break;
        default:
          c = algorithm13(x, y, _unequal, false);
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
          c = algorithm11(y, x, _unequal, true);
          break;
        default:
          c = algorithm13(y, x, _unequal, true);
          break;
      }
      return c;
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(x), y, _unequal, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm13(matrix(y), x, _unequal, true).valueOf();
    }
  });

  var _unequal = typed('_unequal', {

    'boolean, boolean': function (x, y) {
      return x !== y;
    },

    'number, number': function (x, y) {
      return !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return !x.eq(y);
    },

    'Complex, Complex': function (x, y) {
      return !nearlyEqual(x.re, y.re, config.epsilon) ||
          !nearlyEqual(x.im, y.im, config.epsilon);
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return !nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x !== y;
    }
  });

  return unequal;
}

exports.name = 'unequal';
exports.factory = factory;
