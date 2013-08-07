module.exports = function (math) {
  var util = require('../../util/index.js');

  /**
   * Determine the type of a variable
   *
   *     typeof(x)
   *
   * @param {*} x
   * @return {String} type  Lower case type, for example "number", "string",
   *                        "array".
   */
  math['typeof'] = function _typeof (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('typeof', arguments.length, 1);
    }

    return util.types.type(x);
  };
};
