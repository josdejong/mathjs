/**
 * Computes the principal value of the arc tangent of y/x in radians, atan2(y,x)
 * @param {Number | Complex | Array | Matrix | Range} y
 * @param {Number | Complex | Array | Matrix | Range} x
 * @return {Number | Complex | Array | Matrix} res
 */
math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
        throw newArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
        if (isNumber(x)) {
            return Math.atan2(y, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y, x.re);
        }
    }
    else if (y instanceof Complex) {
        if (isNumber(x)) {
            return Math.atan2(y.re, x);
        }
        else if (x instanceof Complex) {
            return Math.atan2(y.re, x.re);
        }
    }

    if (y instanceof Array || y instanceof Matrix ||
        x instanceof Array || x instanceof Matrix) {
        return util.map2(y, x, math.atan2);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
        // fallback on the objects primitive values
        return math.atan2(y.valueOf(), x.valueOf());
    }

    throw newUnsupportedTypeError('atan2', y, x);
};
