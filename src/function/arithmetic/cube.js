/**
 * Compute the cube of a value, x * x * x.',
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.cube = function cube(x) {
    if (arguments.length != 1) {
        throw newArgumentsError('cube', arguments.length, 1);
    }

    if (isNumber(x)) {
        return x * x * x;
    }

    if (x instanceof Complex) {
        return math.multiply(math.multiply(x, x), x);
    }

    if (x instanceof Array || x instanceof Matrix) {
        return math.multiply(math.multiply(x, x), x);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.cube(x.valueOf());
    }

    throw newUnsupportedTypeError('cube', x);
};
