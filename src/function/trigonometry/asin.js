/**
 * Calculate the inverse sine of a value
 *
 *     asin(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseSine.html
 */
math.asin = function asin(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('asin', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= -1 && x <= 1) {
            return Math.asin(x);
        }
        else {
            return math.asin(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        // asin(z) = -i*log(iz + sqrt(1-z^2))
        var re = x.re;
        var im = x.im;
        var temp1 = new Complex(
            im * im - re * re + 1.0,
            -2.0 * re * im
        );

        var temp2 = math.sqrt(temp1);
        var temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );

        var temp4 = math.log(temp3);

        return new Complex(temp4.im, -temp4.re);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.asin);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.asin(x.valueOf());
    }

    throw newUnsupportedTypeError('asin', x);
};
