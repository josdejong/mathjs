module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Compare two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.dotEqual(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.dotEqual(2, 4);   // returns false
   *
   *    a = [2, 5, 1];
   *    b = [2, 7, 1];
   *
   *    math.dotEqual(a, b);   // returns [true, false, true]
   *    math.equal(a, b);      // returns false
   *
   * See also:
   *
   *    equal, unequal, dotuneuqal
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x First matrix to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y Second matrix to compare
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns a matrix containing boolean results of the element wise comparisons.
   */
  math.dotEqual = function dotEqual(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('dotEqual', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.equal);
  };
};
