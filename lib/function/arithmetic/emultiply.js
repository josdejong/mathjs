module.exports = function (math) {
  var collection = require('../../type/collection');

  /**
   * Multiply two values element wise.
   *
   *     x .* y
   *     emultiply(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.emultiply = function emultiply(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('emultiply', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.multiply);
  };
};
