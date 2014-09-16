'use strict';

module.exports = function (math) {
  var collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isArray = Array.isArray;

  /**
   * Test element wise whether two matrices are equal.
   * The function accepts both matrices and scalar values.
   *
   * Syntax:
   *
   *    math.deepEqual(x, y)
   *
   * Examples:
   *
   *    math.deepEqual(2, 4);   // returns false
   *
   *    a = [2, 5, 1];
   *    b = [2, 7, 1];
   *
   *    math.deepEqual(a, b);   // returns false
   *    math.equal(a, b);       // returns [true, false, true]
   *
   * See also:
   *
   *    equal, unequal
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First matrix to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second matrix to compare
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns true when the input matrices have the same size and each of their elements is equal.
   */
  math.deepEqual = function deepEqual(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('deepEqual', arguments.length, 2);
    }

    if (isCollection(x) || isCollection(y)) {
      return _deepEqual(x.valueOf(), y.valueOf());
    }

    return math.equal(x, y);
  };

  /**
   * Test whether two arrays have the same size and all elements are equal
   * @param {Array | *} x
   * @param {Array | *} y
   * @return {boolean} Returns true if both arrays are deep equal
   */
  function _deepEqual(x, y) {
    if (isArray(x)) {
      if (isArray(y)) {
        var len = x.length;
        if (len !== y.length) return false;

        for (var i = 0; i < len; i++) {
          if (!_deepEqual(x[i], y[i])) return false;
        }

        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (isArray(y)) {
        return false;
      }
      else {
        return math.equal(x, y);
      }
    }
  }
};
