module.exports = function (math) {
  var object = require('../../util/object');

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
      throw new math.error.ArgumentsError('clone', arguments.length, 1);
    }

    return object.clone(x);
  };
};
