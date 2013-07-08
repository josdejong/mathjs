/**
 * Inverse the sign of a value.
 *
 *     -x
 *     unary(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.unary = function unary(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('unary', arguments.length, 1);
    }

    if (isNumber(x)) {
        return -x;
    }
    else if (x instanceof Complex) {
        return Complex.create(
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
        return util.map(x, math.unary);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.unary(x.valueOf());
    }

    throw newUnsupportedTypeError('unary', x);
};

// TODO: deprecated since version  0.10.0, cleanup some day
math.unaryminus = function unaryminus(x) {
    throw new Error('Function unaryminus is deprecated, use unary instead');
};
