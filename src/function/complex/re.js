/**
 * Get the real part of a complex number.
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Array | Matrix} re
 */
math.re = function re(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return x.re;
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, math.re);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.re(x.valueOf());
    }

    // TODO: return just the value itself for all non-complex values?
    throw newUnsupportedTypeError('re', x);
};
