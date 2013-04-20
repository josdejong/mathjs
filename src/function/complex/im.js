/**
 * Get the imaginary part of a complex number.
 *
 *     im(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} im
 */
math.im = function im(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 0;
    }

    if (x instanceof Complex) {
        return x.im;
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.im);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.im(x.valueOf());
    }

    // return 0 for all non-complex values
    return 0;
};
