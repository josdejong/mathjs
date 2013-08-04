/**
 * Utility functions for Numbers
 */


/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
function isNumber(value) {
  return (value instanceof Number) || (typeof value == 'number');
}

/**
 * Check if a number is integer
 * @param {Number} value
 * @return {Boolean} isInteger
 */
function isInteger(value) {
  return (value == Math.round(value));
}
