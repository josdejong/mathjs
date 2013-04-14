/**
 * Compute the square of a value, x * x
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.square = function square(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('square', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x;
    }

    if (x instanceof Complex) {
        return math.multiply(x, x);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return math.multiply(x, x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.square(x.valueOf());
    }

    throw newUnsupportedTypeError('square', x);
};
