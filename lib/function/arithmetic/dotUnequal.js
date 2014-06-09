module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Test element wise whether two matrices are unequal.
   * The function accepts both matrices and scalar values.
   *
   * Syntax:
   *
   *    math.dotUnequal(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.dotUnequal(2, 4);  // returns true
   *
   *    a = [2, 5, 1];
   *    b = [2, 7, 1];
   *
   *    math.dotUnequal(a, b);  // returns [false, true, false]
   *    math.unequal(a, b);     // returns true
   *
   * See also:
   *
   *    equal, unequal, dotEqual
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x First matrix to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y Second matrix to compare
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns a matrix containing boolean results of the element wise comparisons.
   */
  math.dotUnequal = function dotUnequal(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('dotUnequal', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.unequal);
  };
};
