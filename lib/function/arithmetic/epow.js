module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection');

  /**
   * Calculates the power of x to y element wise.
   *
   * Syntax:
   *
   *    math.epow(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.epow(2, 3);              // returns Number 8
   *
   *    var a = [[1, 2], [4, 3]];
   *    math.epow(a, 2);              // returns Array [[1, 4], [16, 9]]
   *    math.pow(a, 2);               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    pow, sqrt, multiply
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x  The base
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y  The exponent
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}              The value of `x` to the power `y`
   */
  math.epow = function epow(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('epow', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.pow);
  };
};
