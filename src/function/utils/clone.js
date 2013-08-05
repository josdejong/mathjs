var error = require('../../util/error.js'),
    object = require('../../util/object.js');

/**
 * Clone an object
 *
 *     clone(x)
 *
 * @param {*} x
 * @return {*} clone
 */
module.exports = function (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('clone', arguments.length, 1);
  }

  return object.clone(x);
};
