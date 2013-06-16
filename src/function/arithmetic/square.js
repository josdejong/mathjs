/**
 * Compute the square of a value
 *
 *     x .* x
 *     square(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix | Unit} x
 * @return {Number | Complex | Array | Matrix | Unit} res
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
        return util.map(x, math.square);
    }

    if(x instanceof Unit){
        var value = x.value * x.value;
        var dimensions = math.clone(x.unit.base.dimensions);
        for (var dim in dimensions){
            dimensions[dim] *=  2;
        }
        return new Unit(value, dimensions);

    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.square(x.valueOf());
    }

    throw newUnsupportedTypeError('square', x);
};
