/**
 * Round a value towards minus infinity
 *
 *     floor(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.floor = function floor(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('floor', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.floor(x);
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.floor(x.re),
            Math.floor(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.floor);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.floor(x.valueOf());
    }

    throw newUnsupportedTypeError('floor', x);
};
