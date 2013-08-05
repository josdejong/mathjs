var collection = require('../../type/collection.js'),
    error = require('../../util/error.js');

/**
 * Divide two values element wise.
 *
 *     x ./ y
 *     edivide(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
module.exports = function edivide(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('edivide', arguments.length, 2);
  }

  return collection.deepMap2(x, y, divide);
};

// require after module.exports because of possible circular references
var divide = require('./divide.js');
