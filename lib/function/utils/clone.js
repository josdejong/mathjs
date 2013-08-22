module.exports = function (math) {
  var util = require('../../util/index.js'),
      object = util.object;

  /**
   * Clone an object
   *
   *     clone(x)
   *
   * @param {*} x
   * @return {*} clone
   */
  math.clone = function clone (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('clone', arguments.length, 1);
    }

    return object.clone(x);
  };
};
