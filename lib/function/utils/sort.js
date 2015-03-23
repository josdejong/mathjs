'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix;

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
   *        An optional comparator function. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {Matrix | Array} Returns the sorted matrix.
   */
  math.sort = function (x, compare) {
    var _compare = null;

    if (arguments.length === 1) {
      _compare = math.compare;
    }
    else if (arguments.length === 2) {
      if (typeof compare === 'function') {
        _compare = compare;
      }
      else if (compare === 'asc') {
        _compare = math.compare;
      }
      else if (compare === 'desc') {
        _compare = function (a, b) {
          return -math.compare(a, b);
        }
      }
      else {
        throw new math.error.UnsupportedTypeError('sort', math['typeof'](x), math['typeof'](compare));
      }
    }
    else {
      throw new math.error.ArgumentsError('sort', arguments.length, 1, 2);
    }

    if (x instanceof Matrix) {
      var size = x.size();
      if (size.length > 1) {
        throw new Error('Only one dimensional matrices supported');
      }
      return math.matrix(x.toArray().sort(_compare));
    }
    else if (Array.isArray(x)) {
      return x.sort(_compare);
    }
    else {
      throw new math.error.UnsupportedTypeError('sort', math['typeof'](x), math['typeof'](compare));
    }
  };
};