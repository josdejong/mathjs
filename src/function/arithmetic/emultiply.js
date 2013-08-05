var collection = require('../../type/collection.js'),
    error = require('../../util/error.js');

/**
 * Multiply two values element wise.
 *
 *     x .* y
 *     emultiply(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
module.exports = function emultiply(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('emultiply', arguments.length, 2);
  }

  return collection.deepMap2(x, y, multiply);
};

// require after module.exports because of possible circular references
var multiply = require('./multiply.js');
