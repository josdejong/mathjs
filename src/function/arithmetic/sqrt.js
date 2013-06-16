/**
 * Calculate the square root of a value
 *
 *     sqrt(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix | Unit} x
 * @return {Number | Complex | Array | Matrix| Unit} res
 */
math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
        throw newArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumber(x)) {
        if (x >= 0) {
            return Math.sqrt(x);
        }
        else {
            return math.sqrt(new Complex(x, 0));
        }
    }

    if (x instanceof Complex) {
        var r = Math.sqrt(x.re * x.re + x.im * x.im);
        if (x.im >= 0.0) {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
        else {
            return new Complex(
                0.5 * Math.sqrt(2.0 * (r + x.re)),
                -0.5 * Math.sqrt(2.0 * (r - x.re))
            );
        }
    }
    if(x instanceof Unit){
            var value = Math.sqrt(x.value);
            var dimensions = math.clone(x.unit.base.dimensions);
            for (var dim in dimensions){
                    dimensions[dim] /=  2;
            }
            return new Unit(value,dimensions);

    }

    if (x instanceof Array || x instanceof Matrix) {
        return util.map(x, math.sqrt);
    }

    if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return math.sqrt(x.valueOf());
    }

    throw newUnsupportedTypeError('sqrt', x);
};
