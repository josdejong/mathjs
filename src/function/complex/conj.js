/**
 * Compute the complex conjugate of a complex value.
 * If x = a+bi, the complex conjugate is a-bi.
 *
 *     conj(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.conj = function conj(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('conj', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x;
    }

    if (x instanceof Complex) {
        return Complex.create(x.re, -x.im);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.conj);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.conj(x.valueOf());
    }

    // return a clone of the value for non-complex values
    return clone(x);
};
