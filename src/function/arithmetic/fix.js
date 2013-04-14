/**
 * Round a value towards zero, fix(x)
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.fix = function fix(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
        return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (x instanceof Complex) {
        return new Complex(
            (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
            (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
        );
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.fix);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.fix(x.valueOf());
    }

    throw newUnsupportedTypeError('fix', x);
};
