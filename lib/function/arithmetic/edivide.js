module.exports = function (math) {
  var util = require('../../util/index.js'),
      collection = require('../../type/collection.js');

  /**
   * Divide two values element wise.
   *
   *     x ./ y
   *     edivide(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('edivide', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.divide);
  };
};
