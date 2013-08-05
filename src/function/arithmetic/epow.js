var collection = require('../../type/collection.js'),
    error = require('../../util/error.js');

/**
 * Calculates the power of x to y element wise
 *
 *     x .^ y
 *     epow(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex | Unit | Array | Matrix} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
module.exports = function epow(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('epow', arguments.length, 2);
  }

  return collection.deepMap2(x, y, pow);
};

// require after module.exports because of possible circular references
var pow = require('./pow.js');
