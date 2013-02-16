/**
 * Helper methods for functions
 */

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} fn
 * @param {*} value
 * @return {TypeError | Error} error
 */
function newUnsupportedTypeError(fn, value) {
    var t = type(value);
    var msg = 'Function ' + fn + ' does not support a parameter of type ' + t;

    if ((typeof TypeError) != 'undefined') {
        return new TypeError(msg);
    }
    else {
        return new Error(msg);
    }
}
