/**
 * Calculate the 10-base logarithm of a value, log10(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.log10 = function log10(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('log10', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.log(x) / Math.LN10;
        }
        else {
            // negative value -> complex value computation
            return math.log10(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
            Math.atan2(x.im, x.re) / Math.LN10
        );
    }

    if (x instanceof Array || x instanceof Matrix || x instanceof Range) {
        return util.map(x, math.log10);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.log10(x.valueOf());
    }

    throw newUnsupportedTypeError('log10', x);
};
