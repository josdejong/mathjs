module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Calculates the power of x to y element wise
   *
   *     x .^ y
   *     epow(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.epow = function epow(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('epow', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.pow);
  };
};
