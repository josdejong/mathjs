module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Divide two matrices element wise. The function accepts both matrices and
   * scalar values.
   *
   * Syntax:
   *
   *    math.edivide(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.edivide(2, 4);   // returns 0.5
   *
   *    a = [[9, 5], [6, 1]];
   *    b = [[3, 2], [5, 2]];
   *
   *    math.edivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
   *    math.divide(a, b);    // returns [[1.75, 0.75], [-1.75, 2.25]]
   *
   * See also:
   *
   *    divide, multiply, emultiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x Numerator
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y Denominator
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}             Quotient, `x ./ y`
   */
  math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('edivide', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.divide);
  };
};
