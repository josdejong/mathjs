/**
 * Calculate the cotangent of a value, cot(x) = 1/tan(x)
 * @param {Number | Complex | Unit | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.cot = function cot(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cot', arguments.length, 1);
    }

    if (isNumber(x)) {
        return 1 / Math.tan(x);
    }

    if (x instanceof Complex) {
        var den = Math.exp(-4.0 * x.im) -
            2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

        return new Complex(
            2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
            (Math.exp(-4.0 * x.im) - 1.0) / den
        );
    }

    if (x instanceof Unit) {
        if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
            throw new TypeError ('Unit in function cot is no angle');
        }
        return 1 / Math.tan(x.value);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.cot);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.cot(x.valueOf());
    }

    throw newUnsupportedTypeError('cot', x);
};
