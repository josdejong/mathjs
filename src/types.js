/**
 * Generic type methods
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
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
function isComplex(value) {
    return (value instanceof Complex);
}

/**
 * Test whether value is a Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
function isUnit(value) {
    return (value instanceof Unit);
}

/**
 * Get the type of an object.
 * @param {*} obj
 * @return {String} type
 */
function type (obj) {
    var t = typeof obj;

    if (t == 'object') {
        if (obj == null) {
            return 'null';
        }
        if (obj instanceof Array) {
            return 'array';
        }
        if (obj && obj.constructor && obj.constructor.name) {
            return obj.constructor.name;
        }
    }

    return t;
}
