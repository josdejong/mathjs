/**
 * Generic type methods
 */

/**
 * Test whether x is a Number
 * @param {*} x
 * @return {Boolean} isNumber
 * @private
 */
function isNumber(x) {
    return (x instanceof Number) || (typeof x == 'number');
}

/**
 * Test whether x is a Complex
 * @param {*} x
 * @return {Boolean} isComplex
 * @private
 */
function isComplex(x) {
    return (x instanceof Complex);
}
