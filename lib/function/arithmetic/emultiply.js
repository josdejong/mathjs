module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection');

  /**
   * Multiply two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.emultiply(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.emultiply(2, 4); // returns 8
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.emultiply(a, b); // returns [[27, 10], [30, 2]]
   *    math.multiply(a, b);  // returns [[52, 28], [23, 14]]
   *
   * See also:
   *
   *    multiply, divide, edivide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x Left hand value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y Right hand value
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}             Multiplication of `x` and `y`
   */
  math.emultiply = function emultiply(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('emultiply', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.multiply);
  };
};
