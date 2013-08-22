/**
 * Test whether value is a Boolean
 * @param {*} value
 * @return {Boolean} isBoolean
 */
exports.isBoolean = function isBoolean(value) {
  return (value instanceof Boolean) || (typeof value == 'boolean');
};
