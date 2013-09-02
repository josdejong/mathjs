module.exports = function (math) {
  var util = require('../../util/index.js'),
      collection = require('../../type/collection.js');

  /**
   * Multiply two values element wise.
   *
   *     x .* y
   *     emultiply(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.emultiply = function emultiply(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('emultiply', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.multiply);
  };
};
