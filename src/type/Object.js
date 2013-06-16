/**
 * Utility functions for Objects
 */

/**
 * Test whether value is an Object
 * @param {*} value
 * @return {Boolean} isObject
 */
function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}
