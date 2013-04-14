/**
 * Round a value towards plus infinity, ceil(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.ceil = function ceil(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.ceil(x.re),
            Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.ceil);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.ceil(x.valueOf());
    }

    throw newUnsupportedTypeError('ceil', x);
};
