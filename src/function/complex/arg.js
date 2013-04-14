/**
 * Compute the argument of a complex value.
 * If x = a+bi, the argument is computed as atan2(b, a).
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} res
 */
math.arg = function arg(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('arg', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan2(0, x);
    }

    if (x instanceof Complex) {
        return Math.atan2(x.im, x.re);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.arg);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.arg(x.valueOf());
    }

    throw newUnsupportedTypeError('arg', x);
};
