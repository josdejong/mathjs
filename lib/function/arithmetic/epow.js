module.exports = function (math) {
  var util = require('../../util/index.js'),
      collection = require('../../type/collection.js');

  /**
   * Calculates the power of x to y element wise
   *
   *     x .^ y
   *     epow(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.epow = function epow(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('epow', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.pow);
  };
};
