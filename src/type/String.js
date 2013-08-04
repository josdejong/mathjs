/**
 * Utility functions for Strings
 */

/**
 * Test whether value is a String
 * @param {*} value
 * @return {Boolean} isString
 */
function isString(value) {
  return (value instanceof String) || (typeof value == 'string');
}
