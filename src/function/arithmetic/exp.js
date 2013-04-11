/**
 * Calculate the exponent of a value, exp(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.exp = function exp (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('exp', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.exp(x);
    }
    if (x instanceof Complex) {
        var r = Math.exp(x.re);
        return new Complex(
            r * Math.cos(x.im),
            r * Math.sin(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, math.exp);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.exp(x.valueOf());
    }

    throw newUnsupportedTypeError('exp', x);
};
