'use strict';

module.exports = function (math) {
  var util = require('../../util/index');
  var Matrix = math.type.Matrix;

  var isNumber = util.number.isNumber;
  var isInteger = util.number.isInteger;

  /**
   * Partition-based selection of an array or 1D matrix.
   * Will find the kth smallest value, and mutates the input array.
   * Uses Quickselect.
   *
   * Syntax:
   *
   *    math.partitionSelect(x, k)
   *    math.partitionSelect(x, k, compare)
   *
   * Examples:
   *
   *    math.partitionSelect([5, 10, 1], 2);           // returns 10
   *    math.partitionSelect(['C', 'B', 'A', 'D'], 1); // returns 'B'
   *
   *    function sortByLength (a, b) {
   *      return a.length - b.length;
   *    }
   *    math.partitionSelect(['Langdon', 'Tom', 'Sara'], 2, sortByLength); // returns 'Langdon'
   *
   * See also:
   *
   *    sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
   * @param {Number} k            The kth smallest value to be retrieved; zero-based index
   * @param {Function | 'asc' | 'desc'} [compare='asc']
   *        An optional comparator function. The function is called as
   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
   *        and 0 when a == b.
   * @return {*} Returns the kth lowest value.
   */
  math.partitionSelect = function (x, k, compare) {
    var _compare;

    if (arguments.length === 2) {
      _compare = math.compare;
    }
    else if (arguments.length === 3) {
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
        throw new math.error.UnsupportedTypeError('partitionSelect', math['typeof'](compare));
      }
    }
    else {
      throw new math.error.ArgumentsError('partitionSelect', arguments.length, 2, 3);
    }

    if (isNumber(k)) {
      if (isInteger(k) && k >= 0) {
        if (x instanceof Matrix) {
          var size = x.size();
          if (size.length > 1) {
            throw new Error('Only one dimensional matrices supported');
          }
          return quickselect(x.valueOf(), k, _compare);
        }

        if (Array.isArray(x)) {
          return quickselect(x, k, _compare);
        }

        throw new math.error.UnsupportedTypeError('partitionSelect', math['typeof'](x));
      }

      throw new Error('k must be a non-negative integer');
    }

    throw new math.error.UnsupportedTypeError('partitionSelect', math['typeof'](k));
  };

  /**
   * Quickselect algorithm.
   * Code adapted from:
   * http://blog.teamleadnet.com/2012/07/quick-select-algorithm-find-kth-element.html
   *
   * @param {Array} arr
   * @param {Number} k
   * @param {Function} compare
   * @private
   */
  function quickselect(arr, k, compare) {
    if (k >= arr.length) {
      throw new Error('k out of bounds');
    }

    var from = 0;
    var to = arr.length - 1;

    // if from == to we reached the kth element
    while (from < to) {
      var r = from;
      var w = to;
      var pivot = arr[Math.floor(Math.random() * (to - from + 1)) + from];

      // stop if the reader and writer meets
      while (r < w) {
        // arr[r] >= pivot
        if (compare(arr[r], pivot) >= 0) { // put the large values at the end
          var tmp = arr[w];
          arr[w] = arr[r];
          arr[r] = tmp;
          --w;
        } else { // the value is smaller than the pivot, skip
          ++r;
        }
      }

      // if we stepped up (r++) we need to step one down (arr[r] > pivot)
      if (compare(arr[r], pivot) > 0) {
        --r;
      }

      // the r pointer is on the end of the first k elements
      if (k <= r) {
        to = r;
      } else {
        from = r + 1;
      }
    }

    return arr[k];
  }
};
