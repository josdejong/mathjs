'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix;

  /**
   * Sort the items in a matrix.
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
  math.filter = function (x, test) {
    if (arguments.length !== 2) {
      throw new math.error.ArgumentsError('filter', arguments.length, 2);
    }

    if (x instanceof Matrix) {
      var size = x.size();
      if (size.length > 1) {
        throw new Error('Only one dimensional matrices supported');
      }
      return math.matrix(_filter(x.toArray(), test));
    }
    else if (Array.isArray(x)) {
      return _filter(x, test);
    }
    else {
      throw new math.error.UnsupportedTypeError('filter', math['typeof'](x), math['typeof'](compare));
    }
  };

  /**
   *
   * @param {Array} x
   * @param {function | RegExp} test
   * @return {Array} Returns the filtered array
   * @private
   */
  function _filter(x, test) {
    if (typeof test === 'function') {
      return x.filter(function (entry) {
        return test(entry);
      });
    }
    else if (test instanceof RegExp) {
      return x.filter(function (entry) {
        return test.test(entry);
      });
    }
    else {
      throw new TypeError('Function or RegExp expected');
    }
  }
};