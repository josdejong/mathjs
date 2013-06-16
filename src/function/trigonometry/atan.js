/**
 * Calculate the inverse tangent of a value
 *
 *     atan(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
math.atan = function atan(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('atan', arguments.length, 1);
    }

    if (isNumber(x)) {
        return Math.atan(x);
    }

    if (x instanceof Complex) {
        // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
        var re = x.re;
        var im = x.im;
        var den = re * re + (1.0 - im) * (1.0 - im);

        var temp1 = Complex.create(
            (1.0 - im * im - re * re) / den,
            (-2.0 * re) / den
        );
        var temp2 = math.log(temp1);

        if (temp2 instanceof Complex) {
            return Complex.create(
                -0.5 * temp2.im,
                0.5 * temp2.re
            );
        }
        else {
            return Complex.create(
                0,
                0.5 * temp2
            );
        }
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.atan);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.atan(x.valueOf());
    }

    throw newUnsupportedTypeError('atan', x);
};
