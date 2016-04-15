'use strict';

var size = require('../../utils/array').size;

function factory (type, config, load, typed) {
  var matrix = load(require('../../type/matrix/function/matrix'));
  
  /**
   * Filter the items in an array or one dimensional matrix.
   *
   * Syntax:
   *
   *    math.filter(x, test)
   *
   * Examples:
   *
   *    function isPositive (x) {
   *      return x > 0;
   *    }
   *    math.filter([6, -2, -1, 4, 3], isPositive); // returns [6, 4, 3]
   *
   *    math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/); // returns ["23", "100", "55"]
   *
   * See also:
   *
   *    forEach, map, sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to filter
   * @param {Function | RegExp} test
   *        A function or regular expression to test items.
   *        When `test` is a function, it must return a boolean.
   *        All entries for which `test` returns true are returned.
   * @return {Matrix | Array} Returns the filtered matrix.
   */
  var filter = typed('filter', {
    'Array, function': _filterCallback,

    'Array, RegExp': _filterRegExp,

    'Matrix, function': function (x, test) {
      return matrix(_filterCallback(x.toArray(), test));
    },

    'Matrix, RegExp': function (x, test) {
      return matrix(_filterRegExp(x.toArray(), test));
    }
  });

  filter.toTex = undefined; // use default template

  return filter;
}

/**
 * Filter values in a callback given a callback function
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterCallback (x, callback) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return x.filter(function (entry) {
    return callback(entry);
  });
}

/**
 * Filter values in a callback given a regular expression
 * @param {Array} x
 * @param {Function} regexp
 * @return {Array} Returns the filtered array
 * @private
 */
function _filterRegExp (x, regexp) {
  if (size(x).length !== 1) {
    throw new Error('Only one dimensional matrices supported');
  }

  return x.filter(function (entry) {
    return regexp.test(entry);
  });
}

exports.name = 'filter';
exports.factory = factory;
