/**
 * Compute the sign of a value.
 *
 *     sign(x)
 *
 * The sign of a value x is 1 when x > 1, -1 when x < 0, and 0 when x == 0
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.sign = function sign(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sign', arguments.length, 1);
    }

    if (isNumber(x)) {
        var sign;
        if (x > 0) {
            sign = 1;
        }
        else if (x < 0) {
            sign = -1;
        }
        else {
            sign = 0;
        }
        return sign;
    }

    if (x instanceof Complex) {
        var abs = Math.sqrt(x.re * x.re + x.im * x.im);
        return Complex.create(x.re / abs, x.im / abs);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sign);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sign(x.valueOf());
    }

    throw newUnsupportedTypeError('sign', x);
};
