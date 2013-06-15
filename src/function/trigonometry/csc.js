/**
 * Calculate the cosecant of a value, csc(x) = 1/sin(x)
 *
 *     csc(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.csc = function csc(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('csc', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.sin(x);
    }

    if (x instanceof Complex) {
        // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
        var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) -
            0.5 * Math.cos(2.0 * x.re);

        return new Complex (
            0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
            0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_QUANTITY.ANGLE)) {
            throw new TypeError ('Unit in function csc is no angle');
        }
        return 1 / Math.sin(x.value);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.csc);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.csc(x.valueOf());
    }

    throw newUnsupportedTypeError('csc', x);
};
