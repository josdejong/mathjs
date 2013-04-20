/**
 * Inverse the sign of a value.
 *
 *     -x
 *     unaryminus(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.unaryminus = function unaryminus(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('unaryminus', arguments.length, 1);
    }

    if (isNumber(x)) {
        return -x;
    }
    else if (x instanceof Complex) {
        return new Complex(
            -x.re,
            -x.im
        );
    }
    else if (x instanceof Unit) {
        var res = x.clone();
        res.value = -x.value;
        return res;
    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.unaryminus);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.unaryminus(x.valueOf());
    }

    throw newUnsupportedTypeError('unaryminus', x);
};
