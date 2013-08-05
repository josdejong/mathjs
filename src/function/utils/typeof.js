var error = require('../../util/error.js'),
    types = require('../../util/types.js');

/**
 * Determine the type of a variable
 *
 *     typeof(x)
 *
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
module.exports = function _typeof (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('typeof', arguments.length, 1);
  }

  return types.type(x);
};
