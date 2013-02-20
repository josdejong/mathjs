/**
 * Helper methods for functions
 */

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} fn
 * @param {*} value1
 * @param {*} [value2]
 * @return {TypeError | Error} error
 */
function newUnsupportedTypeError(fn, value1, value2) {
    var msg = undefined;
    if (arguments.length == 2) {
        var t = _typeof(value1);
        msg = 'Function ' + fn + ' does not support a parameter of type ' + t;
    }
    else if (arguments.length > 2) {
        var types = [];
        for (var i = 1; i < arguments.length; i++) {
            types.push(_typeof(arguments[i]));
        }
        msg = 'Function ' + fn + ' does not support a parameters of type ' + types.join(', ');
    }
    else {
        msg = 'Unsupported parameter in function ' + fn;
    }

    return new TypeError(msg);
}
