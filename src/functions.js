/**
 * Helper methods for functions
 */

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} name   Function name
 * @param {*} value1
 * @param {*} [value2]
 * @return {TypeError | Error} error
 */
function newUnsupportedTypeError(name, value1, value2) {
    var msg = undefined;
    if (arguments.length == 2) {
        var t = math.typeof(value1);
        msg = 'Function ' + name + ' does not support a parameter of type ' + t;
    }
    else if (arguments.length > 2) {
        var types = [];
        for (var i = 1; i < arguments.length; i++) {
            types.push(math.typeof(arguments[i]));
        }
        msg = 'Function ' + name + ' does not support a parameters of type ' + types.join(', ');
    }
    else {
        msg = 'Unsupported parameter in function ' + name;
    }

    return new TypeError(msg);
}

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {String} name   Function name
 * @param {Number} count  Actual argument count
 * @param {Number} min    Minimum required argument count
 * @param {Number} [max]  Maximum required argument count
 */
function newArgumentsError(name, count, min, max) {
    var msg = 'Wrong number of arguments in function ' + name +
        ' (' + count + ' provided, ' +
        min + ((max != undefined) ? ('-' + max) : '') + ' expected)';
    return new SyntaxError(msg);
}
