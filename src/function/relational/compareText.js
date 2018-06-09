'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../type/matrix/function/matrix'));
  var _typeof = load(require('../utils/typeof'));

  var algorithm13 = load(require('../../type/matrix/utils/algorithm13'));
  var algorithm14 = load(require('../../type/matrix/utils/algorithm14'));
  
  /**
   * Compare two strings lexically. Comparison is case sensitive.
   * Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.compareText(x, y)
   *
   * Examples:
   *
   *    math.compareText('B', 'A');     // returns 1
   *    math.compareText('2', '10');    // returns 1
   *    math.compare('2', '10');        // returns -1
   *    math.compareNatural('2', '10'); // returns -1
   *
   *    math.compareText('B', ['A', 'B', 'C']); // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, equalText, compare, compareNatural
   *
   * @param  {string | Array | DenseMatrix} x First string to compare
   * @param  {string | Array | DenseMatrix} y Second string to compare
   * @return {number | Array | DenseMatrix} Returns the result of the comparison:
   *                                        1 when x > y, -1 when x < y, and 0 when x == y.
   */
  var compareText = typed('compareText', {

    'any, any': _compareText,

    'DenseMatrix, DenseMatrix': function(x, y) {
      return algorithm13(x, y, _compareText);
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return compareText(matrix(x), matrix(y)).valueOf();
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return compareText(matrix(x), y);
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return compareText(x, matrix(y));
    },

    'DenseMatrix, any': function (x, y) {
      return algorithm14(x, y, _compareText, false);
    },

    'any, DenseMatrix': function (x, y) {
      return algorithm14(y, x, _compareText, true);
    },

    'Array, any': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _compareText, false).valueOf();
    },

    'any, Array': function (x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _compareText, true).valueOf();
    }
  });

  /**
   * Compare two strings
   * @param {string} x
   * @param {string} y
   * @returns {number}
   * @private
   */
  function _compareText(x, y) {
    // we don't want to convert numbers to string, only accept string input
    if (!type.isString(x)) {
      throw new TypeError('Unexpected type of argument in function compareText ' +
          '(expected: string or Array or Matrix, actual: ' + _typeof(x) + ', index: 0)');
    }
    if (!type.isString(y)) {
      throw new TypeError('Unexpected type of argument in function compareText ' +
          '(expected: string or Array or Matrix, actual: ' + _typeof(y) + ', index: 1)');
    }

    return (x === y)
        ? 0
        : (x > y ? 1 : -1);
  }

  compareText.toTex = undefined; // use default template

  return compareText;
}

exports.name = 'compareText';
exports.factory = factory;
