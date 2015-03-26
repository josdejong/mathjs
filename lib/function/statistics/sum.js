'use strict';

var collection = require('../../type/collection');

function factory (type, config, load, typed) {
  var add = load(require('../arithmetic/add'));

  /**
   * Compute the sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the sum of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     math.sum(a, b, c, ...)
   *     math.sum(A)
   *
   * Examples:
   *
   *     math.sum(2, 1, 4, 3);               // returns 10
   *     math.sum([2, 1, 4, 3]);             // returns 10
   *     math.sum([[2, 5], [4, 3], [1, 7]]); // returns 22
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The sum of all values
   */
  return typed('sum', {
    'Array | Matrix': function (args) {
      // sum([a, b, c, d, ...])
      return _sum(args);
    },

    'Array | Matrix, number | BigNumber': function () {
      // sum([a, b, c, d, ...], dim)
      // TODO: implement sum(A, dim)
      throw new Error('sum(A, dim) is not yet supported');
    },

    '...': function () {
      // sum(a, b, c, d, ...)
      return _sum(arguments);
    }
  });

  /**
   * Recursively calculate the sum of an n-dimensional array
   * @param {Array} array
   * @return {Number} sum
   * @private
   */
  function _sum(array) {
    var sum = undefined;

    collection.deepForEach(array, function (value) {
      sum = (sum === undefined) ? value : add(sum, value);
    });

    if (sum === undefined) {
      throw new Error('Cannot calculate sum of an empty array');
    }
    return sum;
  }
}

exports.name = 'sum';
exports.factory = factory;
