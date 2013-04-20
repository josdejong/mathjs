/**
 * Calculates the modulus, the remainder of an integer division.
 *
 *     x % y
 *     mod(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Array | Matrix} x
 * @param  {Number | Complex | Array | Matrix} y
 * @return {Number | Array | Matrix} res
 */
math.mod = function mod(x, y) {
    if (arguments.length != 2) {
        throw newArgumentsError('mod', arguments.length, 2);
    }

    // TODO: only handle integer values in mod?
    if (isNumber(x)) {
        if (isNumber(y)) {
            // number % number
            return x % y;
        }
        else if (y instanceof Complex && y.im == 0) {
            // number % complex
            return x % y.re;
        }
    }
    else if (x instanceof Complex && x.im == 0) {
        if (isNumber(y)) {
            // complex * number
            return x.re % y;
        }
        else if (y instanceof Complex && y.im == 0) {
            // complex * complex
            return x.re % y.re;
        }
    }


    if (x instanceof Array || x instanceof Matrix ||
        y instanceof Array || y instanceof Matrix) {
        return util.map2(x, y, math.mod);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.mod(x.valueOf(), y.valueOf());
    }

    throw newUnsupportedTypeError('mod', x, y);
};
