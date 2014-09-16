'use strict';

/**
 * Test whether value is a Boolean
 * @param {*} value
 * @return {Boolean} isBoolean
 */
exports.isBoolean = function(value) {
  return (value instanceof Boolean) || (typeof value == 'boolean');
};
