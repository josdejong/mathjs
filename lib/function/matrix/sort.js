'use strict';

var size = require('../../utils/array').size;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  var asc = load(require('../relational/compare'));
  var desc = function (a, b) {
    return -asc(a, b);
  };

  /**
   * Sort the items in a matrix.
   *
   * Syntax:
   *
   *    math.sort(x)
   *    math.sort(x, compare)
   *
   * Examples:
   *
   *    math.sort([5, 10, 1]); // returns [1, 5, 10]
   *    math.sort(['C', 'B', 'A', 'D']); // returns ['A', 'B', 'C', 'D']
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length;
   *    }
   *    math.sort(['Langdon', 'Tom', 'Sara'], sortByLength); // returns ['Tom', 'Sara', 'Langdon']
   *
   * See also:
   *
   *    filter, forEach, map
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Function | 'asc' | 'desc'} [compare='asc']
   *        An optional _comparator function. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {Matrix | Array} Returns the sorted matrix.
   */
  var sort = typed('sort', {
    'Array': function (x) {
      _arrayIsVector(x);
      return x.sort(asc);
    },

    'Matrix': function (x) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(asc), x.storage());
    },

    'Array, function': function (x, _comparator) {
      _arrayIsVector(x);
      return x.sort(_comparator);
    },

    'Matrix, function': function (x, _comparator) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(_comparator), x.storage());
    },

    'Array, string': function (x, order) {
      _arrayIsVector(x);
      return x.sort(_comparator(order));
    },

    'Matrix, string': function (x, order) {
      _matrixIsVector(x);
      return matrix(x.toArray().sort(_comparator(order)), x.storage());
    }
  });

  sort.toTex = undefined; // use default template

  /**
   * Get the comparator for given order ('asc' or 'desc')
   * @param {'asc' | 'desc'} order
   * @return {Function} Returns a _comparator function
   */
  function _comparator (order) {
    if (order === 'asc') {
      return asc;
    }
    else if (order === 'desc') {
      return desc;
    }
    else {
      throw new Error('String "asc" or "desc" expected');
    }
  }

  /**
   * Validate whether an array is one dimensional
   * Throws an error when this is not the case
   * @param {Array} array
   * @private
   */
  function _arrayIsVector (array) {
    if (size(array).length !== 1) {
      throw new Error('One dimensional array expected');
    }
  }

  /**
   * Validate whether a matrix is one dimensional
   * Throws an error when this is not the case
   * @param {Matrix} matrix
   * @private
   */
  function _matrixIsVector (matrix) {
    if (matrix.size().length !== 1) {
      throw new Error('One dimensional matrix expected');
    }
  }

  return sort;
}

exports.name = 'sort';
exports.factory = factory;
