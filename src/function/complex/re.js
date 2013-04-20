/**
 * Get the real part of a complex number.
 *
 *     re(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
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

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.re);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.re(x.valueOf());
    }

    // return a clone of the value itself for all non-complex values
    return math.clone(x);
};
