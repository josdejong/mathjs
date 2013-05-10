/**
 * Calculate the logarithm of a value
 *
 *     log(x)
 *     log(x, base)
 *
 * base is optional. If not provided, the natural logarithm of x is calculated.
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array | Matrix} res
 */
math.log = function log(x, base) {
    if (arguments.length == 1) {
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

        if (x.valueOf() !== x) {
            // fallback on the objects primitive values
            return math.log(x.valueOf());
        }

        throw newUnsupportedTypeError('log', x);
    }
    else if (arguments.length == 2) {
        // calculate logarithm for a specified base, log(x, base)
        return math.divide(math.log(x), math.log(base));
    }
    else {
        throw newArgumentsError('log', arguments.length, 1, 2);
    }
};
