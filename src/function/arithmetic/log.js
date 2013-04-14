/**
 * Calculate the logarithm of a value, log(x [, base])
 * base is optional. If not provided, the natural logarithm of x is calculated
 * logarithm for any base, like log(x, base)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array | Matrix} res
 */
math.log = function log(x, base) {
    if (arguments.length != 1 && arguments.length != 2) {
        throw newArgumentsError('log', arguments.length, 1, 2);
    }

    if (base === undefined) {
        // calculate natural logarithm, log(x)
        if (isNumber(x)) {
            if (x >= 0) {
                return Math.log(x);
            }
            else {
                // negative value -> complex value computation
                return math.log(new Complex(x, 0));
            }
        }

        if (x instanceof Complex) {
            return new Complex (
                Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
                Math.atan2(x.im, x.re)
            );
        }

        if (x instanceof Array || x instanceof Matrix) {
            return util.map(x, math.log);
        }
    }
    else {
        // calculate logarithm for a specified base, log(x, base)
        return math.divide(math.log(x), math.log(base));
    }

    if (x.valueOf() !== x || base.valueOf() !== base) {
        // fallback on the objects primitive values
        return math.log(x.valueOf(), base.valueOf());
    }

    throw newUnsupportedTypeError('log', x, base);
};
