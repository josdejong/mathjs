'use strict';

var isInteger = require('../../util/number').isInteger;
var toFixed = require('../../util/number').toFixed;

function factory (type, config, load, typed) {

  var collection = load(require('../../type/matrix/collection'));
  var matrix = load(require('../../type/matrix/function/matrix'));
  var equalScalar = load(require('../relational/equalScalar'));
  var zeros = load(require('../matrix/zeros'));

  var algorithm11 = load(require('../../type/matrix/util/algorithm11'));
  var algorithm12 = load(require('../../type/matrix/util/algorithm12'));
  var algorithm14 = load(require('../../type/matrix/util/algorithm14'));
  
  /**
   * Round a value towards the nearest integer.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.round(x)
   *    math.round(x, n)
   *
   * Examples:
   *
   *    math.round(3.2);              // returns Number 3
   *    math.round(3.8);              // returns Number 4
   *    math.round(-4.2);             // returns Number -4
   *    math.round(-4.7);             // returns Number -5
   *    math.round(math.pi, 3);       // returns Number 3.142
   *    math.round(123.45678, 2);     // returns Number 123.46
   *
   *    var c = math.complex(3.2, -2.7);
   *    math.round(c);                // returns Complex 3 - 3i
   *
   *    math.round([3.2, 3.8, -4.7]); // returns Array [3, 4, -5]
   *
   * See also:
   *
   *    ceil, fix, floor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Number to be rounded
   * @param  {Number | BigNumber | Boolean | Array | null} [n=0]                 Number of decimals
   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
   */
  var round = typed('round', {

    'number': Math.round,

    'number, number': function (x, n) {
      if (!isInteger(n))   {throw new TypeError('Number of decimals in function round must be an integer');}
      if (n < 0 || n > 15) {throw new Error('Number of decimals in function round must be in te range of 0-15');}

      return _round(x, n);
    },

    'Complex': function (x) {
      return new type.Complex (
          Math.round(x.re),
          Math.round(x.im)
      );
    },

    'Complex, number': function (x, n) {
      return new type.Complex (
          _round(x.re, n),
          _round(x.im, n)
      );
    },

    'Complex, BigNumber': function (x, n) {
      var _n = n.toNumber();
      return new type.Complex (
          _round(x.re, _n),
          _round(x.im, _n)
      );
    },

    'BigNumber': function (x) {
      return x.toDecimalPlaces(0);
    },

    'BigNumber, BigNumber': function (x, n) {
      if (!n.isInteger()) {throw new TypeError('Number of decimals in function round must be an integer');}

      return x.toDecimalPlaces(n.toNumber());
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since round(0) = 0
      return collection.deepMap(x, round, true);
    },

    'Matrix, number | BigNumber': function (x, y) {
      // result
      var c;
      // check storage format
      switch (x.storage()) {
        case 'sparse':
          c = algorithm11(x, y, round, false);
          break;
        default:
          c = algorithm14(x, y, round, false);
          break;
      }
      return c;
    },

    'number | Complex | BigNumber, Matrix': function (x, y) {
      // check scalar is zero
      if (!equalScalar(x, 0)) {
        // result
        var c;
        // check storage format
        switch (y.storage()) {
          case 'sparse':
            c = algorithm12(y, x, round, true);
            break;
          default:
            c = algorithm14(y, x, round, true);
            break;
        }
        return c;
      }
      // do not execute algorithm, result will be a zero matrix
      return zeros(y.size(), y.storage());
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, round, false).valueOf();
    },

    'number | Complex | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, round, true).valueOf();
    }
  });

  return round;
}

/**
 * round a number to the given number of decimals, or to zero if decimals is
 * not provided
 * @param {Number} value
 * @param {Number} decimals       number of decimals, between 0 and 15 (0 by default)
 * @return {Number} roundedValue
 * @private
 */
function _round (value, decimals) {
  return parseFloat(toFixed(value, decimals));
}

exports.name = 'round';
exports.factory = factory;
