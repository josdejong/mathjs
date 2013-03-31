/**
 * Utility functions for Booleans
 */


/**
 * Test whether value is a Boolean
 * @param {*} value
 * @return {Boolean} isBoolean
 */
function isBoolean(value) {
    return (value instanceof Boolean) || (typeof value == 'boolean');
}
