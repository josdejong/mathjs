/**
 * Clone an object
 *
 *     clone(x)
 *
 * @param {*} x
 * @return {*} clone
 */
math.clone = function clone(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('clone', arguments.length, 1);
    }

    if (x == null) {
        // null or undefined
        return x;
    }

    if (typeof(x.clone) === 'function') {
        return x.clone();
    }

    if (isNumber(x) || isString(x) || isBoolean(x)) {
        return x;
    }

    if (x instanceof Array) {
        var c = math.clone;
        return x.map(function (value) {
            return c(value);
        });
    }

    if (x instanceof Object) {
        return util.mapObject(x, math.clone);
    }

    throw newUnsupportedTypeError('clone', x);
};
