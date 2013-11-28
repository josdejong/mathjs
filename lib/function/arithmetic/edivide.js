module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Divide two values element wise.
   *
   *     x ./ y
   *     edivide(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('edivide', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.divide);
  };
};
